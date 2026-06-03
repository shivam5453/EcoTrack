// EcoTrack Carbon Footprint Calculator - Application Logic (SOLID Async & MongoDB Integrated)

// ============================================================================
// 1. SERVICES & DEPENDENCY INVERSION (DIP)
// ============================================================================

/**
 * StorageProvider Interface (Abstraction)
 * Satisfies the Dependency Inversion Principle (DIP).
 * All data access services implement this async layout so they are fully swap-compatible (LSP).
 */
class StorageProvider {
    async saveUser(username, userData) { throw new Error("Method saveUser() must be implemented"); }
    async getUser(username) { throw new Error("Method getUser() must be implemented"); }
    async hasUser(username) { throw new Error("Method hasUser() must be implemented"); }
    async saveSession(username, token) { throw new Error("Method saveSession() must be implemented"); }
    async getSession() { throw new Error("Method getSession() must be implemented"); }
    async clearSession() { throw new Error("Method clearSession() must be implemented"); }
    async registerUser(username, password) { throw new Error("Method registerUser() must be implemented"); }
    async authenticateUser(username, password) { throw new Error("Method authenticateUser() must be implemented"); }
}

/**
 * LocalStorageProvider (Asynchronous implementation of StorageProvider)
 * Gracefully acts as the offline mockup database.
 */
class LocalStorageProvider extends StorageProvider {
    constructor() {
        super();
        this.prefix = "ecotrack_";
    }

    async saveUser(username, profileData) {
        const userData = this.getUserSync(username);
        if (userData) {
            userData.profileData = profileData;
            localStorage.setItem(this.prefix + "user_" + username.toLowerCase(), JSON.stringify(userData));
        }
    }

    async getUser(username) {
        return this.getUserSync(username);
    }

    getUserSync(username) {
        const data = localStorage.getItem(this.prefix + "user_" + username.toLowerCase());
        return data ? JSON.parse(data) : null;
    }

    async hasUser(username) {
        return localStorage.getItem(this.prefix + "user_" + username.toLowerCase()) !== null;
    }

    async saveSession(username) {
        localStorage.setItem(this.prefix + "session", username);
    }

    async getSession() {
        return localStorage.getItem(this.prefix + "session");
    }

    async clearSession() {
        localStorage.removeItem(this.prefix + "session");
    }

    async registerUser(username, password) {
        const cleanName = username.trim();
        if (await this.hasUser(cleanName)) {
            return { success: false, message: "Username already exists." };
        }

        const defaultProfile = this.getDefaultProfile();
        const userData = {
            username: cleanName,
            password: password, // In a local mock we save it directly
            profileData: defaultProfile
        };

        localStorage.setItem(this.prefix + "user_" + cleanName.toLowerCase(), JSON.stringify(userData));
        return { success: true, message: "Registration successful! You can now log in." };
    }

    async authenticateUser(username, password) {
        const cleanName = username.trim();
        const userData = await this.getUser(cleanName);
        if (!userData || userData.password !== password) {
            return { success: false, message: "Incorrect username or password." };
        }

        await this.saveSession(cleanName);
        return {
            success: true,
            message: `Welcome back, ${cleanName}!`,
            user: {
                username: cleanName,
                profileData: userData.profileData
            }
        };
    }

    getDefaultProfile() {
        return {
            householdSize: 2,
            electricity: 300,
            gridType: 'avg',
            heatingType: 'gas',
            heatingUsage: 400,
            carDistance: 10000,
            carType: 'petrol',
            transitDistance: 50,
            flightsShort: 2,
            flightsLong: 1,
            dietType: 'average',
            recyclePaper: true,
            recyclePlastic: true,
            recycleGlass: false,
            recycleMetal: false,
            wasteLevel: 'low',
            activeStep: 1,
            actions: {
                led: false,
                solar: false,
                transit: false,
                veggie: false,
                dry: false,
                smart: false
            }
        };
    }
}

/**
 * MongoApiStorageProvider (REST Client database implementation of StorageProvider)
 * Communicates with the Express & MongoDB backend service.
 */
class MongoApiStorageProvider extends StorageProvider {
    constructor(baseUrl = "") {
        super();
        this.baseUrl = baseUrl;
        this.tokenKey = "ecotrack_jwt_token";
        this.usernameKey = "ecotrack_session_username";
    }

    async saveUser(username, profileData) {
        const token = localStorage.getItem(this.tokenKey);
        if (!token) return;

        try {
            await fetch(`${this.baseUrl}/api/profile/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ profileData })
            });
        } catch (err) {
            console.error("API Profile Save Error:", err);
        }
    }

    async getUser(username) {
        const token = localStorage.getItem(this.tokenKey);
        if (!token) return null;

        try {
            const res = await fetch(`${this.baseUrl}/api/profile/load`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                return { profileData: data.profileData };
            }
            return null;
        } catch (err) {
            console.error("API Profile Load Error:", err);
            return null;
        }
    }

    async hasUser(username) {
        // Backend handles unique username enforcement inside the API registration
        return false;
    }

    async saveSession(username, token) {
        localStorage.setItem(this.usernameKey, username);
        if (token) localStorage.setItem(this.tokenKey, token);
    }

    async getSession() {
        return localStorage.getItem(this.usernameKey);
    }

    async clearSession() {
        localStorage.removeItem(this.usernameKey);
        localStorage.removeItem(this.tokenKey);
    }

    async registerUser(username, password) {
        try {
            const res = await fetch(`${this.baseUrl}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });
            return await res.json();
        } catch (err) {
            console.error("API Register Connection Error:", err);
            return { success: false, message: "Database connection failed. Please try again." };
        }
    }

    async authenticateUser(username, password) {
        try {
            const res = await fetch(`${this.baseUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (data.success) {
                await this.saveSession(data.user.username, data.token);
            }
            return data;
        } catch (err) {
            console.error("API Login Connection Error:", err);
            return { success: false, message: "Database connection failed. Please try again." };
        }
    }
}

// ============================================================================
// 2. AUTHENTICATION & SESSION SERVICE (SRP)
// ============================================================================

/**
 * AuthManager (Single Responsibility: User Authentication & Sessions)
 * Now fully async and storage-agnostic.
 */
class AuthManager {
    /**
     * @param {StorageProvider} storage - Injected storage service (DIP)
     */
    constructor(storage) {
        this.storage = storage;
        this.currentUser = null;
    }

    async restoreSession() {
        const username = await this.storage.getSession();
        if (username) {
            const userData = await this.storage.getUser(username);
            if (userData) {
                this.currentUser = { username, data: userData.profileData };
                return true;
            }
        }
        return false;
    }

    async register(username, password) {
        return await this.storage.registerUser(username, password);
    }

    async login(username, password) {
        const res = await this.storage.authenticateUser(username, password);
        if (res.success) {
            this.currentUser = { username: res.user.username, data: res.user.profileData };
        }
        return res;
    }

    async logout() {
        this.currentUser = null;
        await this.storage.clearSession();
    }

    async saveCurrentUserData(profileData) {
        if (!this.currentUser) return;
        this.currentUser.data = profileData;
        await this.storage.saveUser(this.currentUser.username, profileData);
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// ============================================================================
// 3. EMISSION MODELING - OPEN/CLOSED PRINCIPLE (OCP) & LISKOV SUBSTITUTION (LSP)
// ============================================================================

class BaseEmissionCategory {
    constructor(id, name, color) {
        if (this.constructor === BaseEmissionCategory) {
            throw new Error("Abstract class BaseEmissionCategory cannot be instantiated directly");
        }
        this.id = id;
        this.name = name;
        this.color = color;
    }
    calculate(state) { throw new Error("Method calculate() must be implemented by subclasses"); }
}

class EnergyCategory extends BaseEmissionCategory {
    constructor() {
        super('energy', 'Energy', 'var(--color-energy)');
        this.GRID_FACTORS = { clean: 0.02, avg: 0.38, dirty: 0.82 };
        this.HEATING_FACTORS = { none: 0, gas: 0.18, oil: 0.27 };
    }
    calculate(state) {
        const elecEmissions = (state.electricity * 12 * this.GRID_FACTORS[state.gridType]) / state.householdSize;
        const heatEmissions = state.heatingType === 'none' 
            ? 0 
            : (state.heatingUsage * 12 * this.HEATING_FACTORS[state.heatingType]) / state.householdSize;
        return (elecEmissions + heatEmissions) / 1000;
    }
}

class TransportCategory extends BaseEmissionCategory {
    constructor() {
        super('transport', 'Transport', 'var(--color-transport)');
        this.CAR_FACTORS = { petrol: 0.18, hybrid: 0.10, electric: 0.04 };
        this.TRANSIT_FACTOR = 0.04;
        this.FLIGHT_FACTORS = { short: 150, long: 900 };
    }
    calculate(state) {
        const carEmissions = state.carDistance * this.CAR_FACTORS[state.carType];
        const transitEmissions = state.transitDistance * 52 * this.TRANSIT_FACTOR;
        const flightEmissions = (state.flightsShort * this.FLIGHT_FACTORS.short) + (state.flightsLong * this.FLIGHT_FACTORS.long);
        return (carEmissions + transitEmissions + flightEmissions) / 1000;
    }
}

class DietCategory extends BaseEmissionCategory {
    constructor() {
        super('diet', 'Diet', 'var(--color-diet)');
        this.DIET_FACTORS = { heavy: 3000, average: 2200, low: 1600, veg: 1200, vegan: 800 };
    }
    calculate(state) { return this.DIET_FACTORS[state.dietType] / 1000; }
}

class WasteCategory extends BaseEmissionCategory {
    constructor() {
        super('waste', 'Waste', 'var(--color-waste)');
        this.WASTE_FACTORS = { low: 250, avg: 450, high: 700 };
        this.RECYCLING_CREDITS = { paper: 35, plastic: 45, glass: 25, metal: 35 };
    }
    calculate(state) {
        const baseWaste = this.WASTE_FACTORS[state.wasteLevel];
        let credits = 0;
        if (state.recyclePaper) credits += this.RECYCLING_CREDITS.paper;
        if (state.recyclePlastic) credits += this.RECYCLING_CREDITS.plastic;
        if (state.recycleGlass) credits += this.RECYCLING_CREDITS.glass;
        if (state.recycleMetal) credits += this.RECYCLING_CREDITS.metal;
        return Math.max(0, baseWaste - credits) / 1000;
    }
}

// ============================================================================
// 4. MAIN CARBON ENGINE (LSP & OCP)
// ============================================================================

class CarbonCalculator {
    constructor(categories = []) { this.categories = categories; }
    addCategory(category) { this.categories.push(category); }
    calculateTotal(state) { return this.categories.reduce((total, category) => total + category.calculate(state), 0); }
    getBreakdown(state) {
        const breakdown = {};
        this.categories.forEach(category => { breakdown[category.id] = category.calculate(state); });
        return breakdown;
    }
}

// ============================================================================
// 5. ACTION PLAN MANAGEMENT (SRP)
// ============================================================================

class ActionPlanManager {
    calculateSavings(state, categories, calculator) {
        let savings = 0;
        const individualSavings = {};

        individualSavings.led = Math.min(0.25, categories.energy);
        if (state.actions.led) savings += individualSavings.led;

        const energyCat = calculator.categories.find(c => c.id === 'energy');
        const electricityEmissions = (state.electricity * 12 * (energyCat ? energyCat.GRID_FACTORS[state.gridType] : 0.38)) / state.householdSize / 1000;
        individualSavings.solar = Math.min(electricityEmissions, categories.energy);
        if (state.actions.solar) savings += individualSavings.solar;

        const transportCat = calculator.categories.find(c => c.id === 'transport');
        const carEmissions = (state.carDistance * (transportCat ? transportCat.CAR_FACTORS[state.carType] : 0.18)) / 1000;
        individualSavings.transit = Math.min(carEmissions * 0.5, 1.2);
        if (state.actions.transit) savings += individualSavings.transit;

        individualSavings.veggie = Math.max(0, Math.min(0.45, categories.diet - 0.8));
        if (state.actions.veggie) savings += individualSavings.veggie;

        const energySavedBySolar = state.actions.solar ? electricityEmissions : 0;
        const currentEnergyRemaining = Math.max(0, categories.energy - energySavedBySolar);
        individualSavings.dry = Math.min(0.15, currentEnergyRemaining);
        if (state.actions.dry) savings += individualSavings.dry;

        const heatingEmissions = state.heatingType === 'none' ? 0 : ((state.heatingUsage * 12 * (energyCat ? energyCat.HEATING_FACTORS[state.heatingType] : 0.18)) / state.householdSize / 1000);
        individualSavings.smart = heatingEmissions * 0.15;
        if (state.actions.smart) savings += individualSavings.smart;

        return { totalSavings: savings, individualSavings };
    }
}

// ============================================================================
// 6. NOTIFICATION SYSTEM (SRP)
// ============================================================================

class ToastNotifier {
    constructor() { this.container = document.getElementById('toast-container'); }

    show(message, type = 'success', duration = 3500) {
        if (!this.container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = '💡';
        if (type === 'success') icon = '✅';
        else if (type === 'error') icon = '❌';
        else if (type === 'info') icon = 'ℹ️';

        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <div class="toast-content">
                <span class="toast-message">${message}</span>
            </div>
        `;
        this.container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('transitionend', () => toast.remove());
        }, duration);
    }
    success(message) { this.show(message, 'success'); }
    error(message) { this.show(message, 'error'); }
    info(message) { this.show(message, 'info'); }
}

// ============================================================================
// 7. USER INTERFACE & STATE COORDINATOR (SRP)
// ============================================================================

class UIController {
    constructor(calculator, auth, actionsManager, notifier) {
        this.calculator = calculator;
        this.auth = auth;
        this.actionsManager = actionsManager;
        this.notifier = notifier;
        this.state = null;
    }

    initialize() {
        this.cacheElements();
        this.bindEvents();
        this.setupTheme();
    }

    cacheElements() {
        this.authContainer = document.getElementById('auth-container');
        this.mainAppContent = document.getElementById('main-app-content');
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        
        this.authTabLogin = document.getElementById('auth-tab-login');
        this.authTabRegister = document.getElementById('auth-tab-register');
        
        this.userProfileBadge = document.getElementById('user-profile-badge');
        this.userGreeting = document.getElementById('user-greeting');
        this.headerSummary = document.getElementById('header-summary');
        this.btnLogout = document.getElementById('btn-logout');
        
        this.themeToggleBtn = document.getElementById('theme-toggle');

        this.tabs = document.querySelectorAll('.tab-btn');
        this.steps = document.querySelectorAll('.wizard-step');
        this.progressBar = document.getElementById('wizard-progress');
        this.btnPrev = document.getElementById('btn-prev');
        this.btnNext = document.getElementById('btn-next');
        
        this.inHousehold = document.getElementById('input-household');
        this.inElectricity = document.getElementById('input-electricity');
        this.inHeating = document.getElementById('input-heating');
        this.gridRadios = document.getElementsByName('grid-type');
        this.heatingRadios = document.getElementsByName('heating-type');
        this.heatingUsageContainer = document.getElementById('heating-usage-container');

        this.valHousehold = document.getElementById('val-household');
        this.valElectricity = document.getElementById('val-electricity');
        this.valHeating = document.getElementById('val-heating');

        this.inCarDistance = document.getElementById('input-car-distance');
        this.inTransit = document.getElementById('input-transit');
        this.inFlightsShort = document.getElementById('input-flights-short');
        this.inFlightsLong = document.getElementById('input-flights-long');
        this.carRadios = document.getElementsByName('car-type');

        this.valCarDistance = document.getElementById('val-car-distance');
        this.valTransit = document.getElementById('val-transit');
        this.valFlightsShort = document.getElementById('val-flights-short');
        this.valFlightsLong = document.getElementById('val-flights-long');

        this.dietRadios = document.getElementsByName('diet-type');
        this.wasteRadios = document.getElementsByName('waste-level');
        this.chkPaper = document.getElementById('recycle-paper');
        this.chkPlastic = document.getElementById('recycle-plastic');
        this.chkGlass = document.getElementById('recycle-glass');
        this.chkMetal = document.getElementById('recycle-metal');

        this.headerTotalVal = document.getElementById('header-total-val');
        this.chartTotalVal = document.getElementById('chart-total-val');
        this.legendEnergy = document.getElementById('legend-energy');
        this.legendTransport = document.getElementById('legend-transport');
        this.legendDiet = document.getElementById('legend-diet');
        this.legendWaste = document.getElementById('legend-waste');
        
        this.donutSegmentsGroup = document.getElementById('donut-segments');
        this.legendItems = document.querySelectorAll('.legend-item');

        this.gaugeFill = document.getElementById('gauge-fill');
        this.gaugeFeedback = document.getElementById('gauge-feedback');

        this.equivTrees = document.getElementById('equiv-trees');
        this.equivFlights = document.getElementById('equiv-flights');
        this.equivDriving = document.getElementById('equiv-driving');

        this.actionToggles = document.querySelectorAll('.action-toggle');
        this.reductionTotalVal = document.getElementById('reduction-total-val');
        this.newTotalVal = document.getElementById('new-total-val');
    }

    bindEvents() {
        this.authTabLogin.addEventListener('click', () => this.switchAuthTab('login'));
        this.authTabRegister.addEventListener('click', () => this.switchAuthTab('register'));

        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        this.btnLogout.addEventListener('click', () => this.handleLogout());

        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (!this.state) return;
                this.state.activeStep = parseInt(tab.getAttribute('data-step'));
                this.updateWizardUI();
                this.saveState();
            });
        });

        this.btnPrev.addEventListener('click', () => {
            if (this.state && this.state.activeStep > 1) {
                this.state.activeStep--;
                this.updateWizardUI();
                this.saveState();
            }
        });

        this.btnNext.addEventListener('click', () => {
            if (this.state && this.state.activeStep < 3) {
                this.state.activeStep++;
                this.updateWizardUI();
                this.saveState();
            } else {
                const actionsSection = document.querySelector('.actions-panel');
                if (actionsSection) {
                    actionsSection.scrollIntoView({ behavior: 'smooth' });
                    actionsSection.style.borderColor = 'var(--color-energy)';
                    setTimeout(() => actionsSection.style.borderColor = 'var(--border-color)', 1200);
                }
            }
        });

        this.setupStateSyncTriggers();
    }

    setupStateSyncTriggers() {
        const updateSlider = (slider, stateProp, displayEl, unit = "") => {
            slider.addEventListener('input', (e) => {
                if (!this.state) return;
                this.state[stateProp] = parseInt(e.target.value) || 0;
                displayEl.textContent = `${this.state[stateProp].toLocaleString()} ${unit}`;
                this.render();
                this.saveState();
            });
        };

        this.inHousehold.addEventListener('input', (e) => {
            if (!this.state) return;
            this.state.householdSize = parseInt(e.target.value) || 1;
            this.valHousehold.textContent = `${this.state.householdSize} ${this.state.householdSize === 1 ? 'person' : 'people'}`;
            this.render();
            this.saveState();
        });
        updateSlider(this.inElectricity, 'electricity', this.valElectricity, 'kWh');
        updateSlider(this.inHeating, 'heatingUsage', this.valHeating, 'kWh');

        const bindRadios = (radios, stateProp) => {
            radios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    if (!this.state) return;
                    this.state[stateProp] = e.target.value;
                    if (stateProp === 'heatingType') this.toggleHeatingInputDisplay();
                    this.render();
                    this.saveState();
                });
            });
        };
        bindRadios(this.gridRadios, 'gridType');
        bindRadios(this.heatingRadios, 'heatingType');
        bindRadios(this.carRadios, 'carType');
        bindRadios(this.dietRadios, 'dietType');
        bindRadios(this.wasteRadios, 'wasteLevel');

        updateSlider(this.inCarDistance, 'carDistance', this.valCarDistance, 'km');
        updateSlider(this.inTransit, 'transitDistance', this.valTransit, 'km');
        
        this.inFlightsShort.addEventListener('input', (e) => {
            if (!this.state) return;
            this.state.flightsShort = parseInt(e.target.value) || 0;
            this.valFlightsShort.textContent = `${this.state.flightsShort} ${this.state.flightsShort === 1 ? 'flight' : 'flights'}`;
            this.render();
            this.saveState();
        });
        
        this.inFlightsLong.addEventListener('input', (e) => {
            if (!this.state) return;
            this.state.flightsLong = parseInt(e.target.value) || 0;
            this.valFlightsLong.textContent = `${this.state.flightsLong} ${this.state.flightsLong === 1 ? 'flight' : 'flights'}`;
            this.render();
            this.saveState();
        });

        const bindCheckbox = (checkbox, stateProp) => {
            checkbox.addEventListener('change', (e) => {
                if (!this.state) return;
                this.state[stateProp] = e.target.checked;
                this.render();
                this.saveState();
            });
        };
        bindCheckbox(this.chkPaper, 'recyclePaper');
        bindCheckbox(this.chkPlastic, 'recyclePlastic');
        bindCheckbox(this.chkGlass, 'recycleGlass');
        bindCheckbox(this.chkMetal, 'recycleMetal');

        this.actionToggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                if (!this.state) return;
                const actionId = toggle.id.replace('action-', '');
                this.state.actions[actionId] = toggle.checked;
                this.render();
                this.saveState();
            });
        });
    }

    showScreenForUser(user) {
        if (user) {
            this.state = user.data;
            this.authContainer.style.display = 'none';
            this.mainAppContent.style.display = 'block';
            this.userProfileBadge.style.display = 'flex';
            this.headerSummary.style.display = 'flex';
            this.btnLogout.style.display = 'flex';
            this.userGreeting.textContent = user.username;
            
            this.hydrateUIInputs();
            this.updateWizardUI();
            this.render();
        } else {
            this.state = null;
            this.authContainer.style.display = 'block';
            this.mainAppContent.style.display = 'none';
            this.userProfileBadge.style.display = 'none';
            this.headerSummary.style.display = 'none';
            this.btnLogout.style.display = 'none';
        }
    }

    switchAuthTab(tab) {
        if (tab === 'login') {
            this.authTabLogin.classList.add('active');
            this.authTabRegister.classList.remove('active');
            this.loginForm.classList.add('active');
            this.registerForm.classList.remove('active');
        } else {
            this.authTabLogin.classList.remove('active');
            this.authTabRegister.classList.add('active');
            this.loginForm.classList.remove('active');
            this.registerForm.classList.add('active');
        }
    }

    toggleHeatingInputDisplay() {
        if (this.state && this.state.heatingType === 'none') {
            this.heatingUsageContainer.style.display = 'none';
        } else {
            this.heatingUsageContainer.style.display = 'block';
        }
    }

    hydrateUIInputs() {
        if (!this.state) return;

        this.inHousehold.value = this.state.householdSize;
        this.inElectricity.value = this.state.electricity;
        this.inHeating.value = this.state.heatingUsage;
        this.inCarDistance.value = this.state.carDistance;
        this.inTransit.value = this.state.transitDistance;
        this.inFlightsShort.value = this.state.flightsShort;
        this.inFlightsLong.value = this.state.flightsLong;

        this.valHousehold.textContent = `${this.state.householdSize} ${this.state.householdSize === 1 ? 'person' : 'people'}`;
        this.valElectricity.textContent = `${this.state.electricity} kWh`;
        this.valHeating.textContent = `${this.state.heatingUsage} kWh`;
        this.valCarDistance.textContent = `${this.state.carDistance.toLocaleString()} km`;
        this.valTransit.textContent = `${this.state.transitDistance} km`;
        this.valFlightsShort.textContent = `${this.state.flightsShort} ${this.state.flightsShort === 1 ? 'flight' : 'flights'}`;
        this.valFlightsLong.textContent = `${this.state.flightsLong} ${this.state.flightsLong === 1 ? 'flight' : 'flights'}`;

        const checkRadioVal = (radios, value) => {
            radios.forEach(radio => { radio.checked = radio.value === value; });
        };
        checkRadioVal(this.gridRadios, this.state.gridType);
        checkRadioVal(this.heatingRadios, this.state.heatingType);
        checkRadioVal(this.carRadios, this.state.carType);
        checkRadioVal(this.dietRadios, this.state.dietType);
        checkRadioVal(this.wasteRadios, this.state.wasteLevel);

        this.toggleHeatingInputDisplay();

        this.chkPaper.checked = this.state.recyclePaper;
        this.chkPlastic.checked = this.state.recyclePlastic;
        this.chkGlass.checked = this.state.recycleGlass;
        this.chkMetal.checked = this.state.recycleMetal;

        this.actionToggles.forEach(toggle => {
            const actionId = toggle.id.replace('action-', '');
            toggle.checked = this.state.actions[actionId] || false;
        });
    }

    updateWizardUI() {
        if (!this.state) return;
        this.steps.forEach(step => {
            const num = parseInt(step.getAttribute('data-step'));
            step.classList.toggle('active', num === this.state.activeStep);
        });
        this.tabs.forEach(tab => {
            const num = parseInt(tab.getAttribute('data-step'));
            tab.classList.toggle('active', num === this.state.activeStep);
        });
        const pct = (this.state.activeStep / 3) * 100;
        this.progressBar.style.width = `${pct}%`;
        this.btnPrev.disabled = this.state.activeStep === 1;
        this.btnNext.textContent = this.state.activeStep === 3 ? 'View Actions ↓' : 'Next Step →';
    }

    // Async Event Handlers
    async handleRegister(e) {
        e.preventDefault();
        const emailInput = document.getElementById('register-email');
        const passwordInput = document.getElementById('register-password');
        const confirmInput = document.getElementById('register-confirm');

        if (passwordInput.value !== confirmInput.value) {
            this.notifier.error("Passwords do not match.");
            return;
        }

        this.notifier.info("Creating account...");
        const res = await this.auth.register(emailInput.value,passwordInput.value);
        if (res.success) {
            this.notifier.success(res.message);
            this.registerForm.reset();
            this.switchAuthTab('login');
        } else {
            this.notifier.error(res.message);
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const usernameInput = document.getElementById('login-username');
        const passwordInput = document.getElementById('login-password');

        this.notifier.info("Signing in...");
        const res = await this.auth.login(usernameInput.value, passwordInput.value);
        if (res.success) {
            this.notifier.success(res.message);
            this.showScreenForUser(this.auth.getCurrentUser());
            this.loginForm.reset();
        } else {
            this.notifier.error(res.message);
        }
    }

    async handleLogout() {
        await this.auth.logout();
        this.showScreenForUser(null);
        this.notifier.info("You have logged out.");
    }

    async saveState() {
        if (this.state) {
            await this.auth.saveCurrentUserData(this.state);
        }
    }

    render() {
        if (!this.state) return;

        const breakdown = this.calculator.getBreakdown(this.state);
        const baseTotal = this.calculator.calculateTotal(this.state);

        const { totalSavings, individualSavings } = this.actionsManager.calculateSavings(
            this.state, breakdown, this.calculator
        );

        const newTotal = Math.max(0.1, baseTotal - totalSavings);
        const format = (v) => v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        this.headerTotalVal.textContent = format(newTotal);
        this.chartTotalVal.textContent = format(newTotal);
        this.reductionTotalVal.textContent = format(totalSavings);
        this.newTotalVal.textContent = format(newTotal);

        this.legendEnergy.textContent = `${format(breakdown.energy)} t`;
        this.legendTransport.textContent = `${format(breakdown.transport)} t`;
        this.legendDiet.textContent = `${format(breakdown.diet)} t`;
        this.legendWaste.textContent = `${format(breakdown.waste)} t`;

        this.drawDonutChart(breakdown, newTotal);
        this.updateGauge(newTotal);
        this.updateEquivalents(newTotal);
        this.updateActionsCardsDOM(individualSavings);
    }

    drawDonutChart(breakdown, total) {
        this.donutSegmentsGroup.innerHTML = '';
        const catKeys = ['energy', 'transport', 'diet', 'waste'];
        const radius = 70;
        const circumference = 2 * Math.PI * radius;
        let accumulatedPercent = 0;

        catKeys.forEach(key => {
            const val = breakdown[key];
            const sumBreakdown = breakdown.energy + breakdown.transport + breakdown.diet + breakdown.waste;
            const pct = sumBreakdown > 0 ? (val / sumBreakdown) : 0;
            
            if (pct <= 0) return;

            const strokeLength = pct * circumference;
            const strokeGap = circumference - strokeLength;
            const strokeOffset = -accumulatedPercent * circumference;

            const categoryInfo = this.calculator.categories.find(c => c.id === key);
            const color = categoryInfo ? categoryInfo.color : '#9ca3af';

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '100');
            circle.setAttribute('cy', '100');
            circle.setAttribute('r', radius.toString());
            circle.setAttribute('class', 'donut-segment');
            circle.setAttribute('stroke', color);
            circle.setAttribute('stroke-dasharray', `${strokeLength} ${strokeGap}`);
            circle.setAttribute('stroke-dashoffset', strokeOffset.toString());
            circle.setAttribute('data-category', key);
            circle.setAttribute('data-pct', (pct * 100).toFixed(1));
            circle.setAttribute('data-value', val.toFixed(2));

            circle.addEventListener('mouseenter', (e) => {
                const category = e.target.getAttribute('data-category');
                const percent = e.target.getAttribute('data-pct');
                const value = e.target.getAttribute('data-value');

                this.chartTotalVal.textContent = value;
                document.querySelector('.chart-center-text .main-unit').innerHTML = `${category.toUpperCase()}<br>(${percent}%)`;
                
                this.legendItems.forEach(item => {
                    if (item.getAttribute('data-category') === category) {
                        item.classList.add('active-highlight');
                    }
                });
            });

            circle.addEventListener('mouseleave', () => {
                this.chartTotalVal.textContent = (total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                document.querySelector('.chart-center-text .main-unit').innerHTML = 't CO₂e/yr';
                this.legendItems.forEach(item => { item.classList.remove('active-highlight'); });
            });

            this.donutSegmentsGroup.appendChild(circle);
            accumulatedPercent += pct;
        });
    }

    updateGauge(total) {
        const maxGaugeTons = 16.0;
        const percentage = Math.min(100, (total / maxGaugeTons) * 100);
        this.gaugeFill.style.width = `${percentage}%`;

        let feedback = '';
        const format = (v) => v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        if (total < 2.0) {
            feedback = `Your footprint is <strong>${format(total)}t</strong>. Outstanding! This aligns with the target (under 2.0t) to halt global warming. 🌲💚`;
            this.gaugeFill.style.background = 'var(--color-success)';
        } else if (total < 4.8) {
            feedback = `Your footprint is <strong>${format(total)}t</strong>. Great job! You are below the global average of 4.8t. Check the actions to get closer to the 2.0t target. ♻️`;
            this.gaugeFill.style.background = 'linear-gradient(90deg, var(--color-success), var(--color-warning))';
        } else if (total < 10.0) {
            feedback = `Your footprint is <strong>${format(total)}t</strong>. You are above the global average (4.8t) but below carbon-intensive averages. Try some green actions to reduce this! 🔌`;
            this.gaugeFill.style.background = 'linear-gradient(90deg, var(--color-success), var(--color-warning), #eab308)';
        } else {
            feedback = `Your footprint is <strong>${format(total)}t</strong>. This is carbon-heavy (national averages are high). Switch to public transit or go solar to make immediate, massive cuts! ⚠️`;
            this.gaugeFill.style.background = 'linear-gradient(90deg, var(--color-success), var(--color-warning), var(--color-danger))';
        }
        this.gaugeFeedback.innerHTML = feedback;
    }

    updateEquivalents(total) {
        const trees = Math.round((total * 1000) / 22);
        this.equivTrees.textContent = trees.toLocaleString();

        const flights = (total / 0.9).toFixed(1);
        this.equivFlights.textContent = flights;

        const driving = Math.round((total * 1000) / 0.18);
        this.equivDriving.textContent = `${driving.toLocaleString()} km`;
    }

    updateActionsCardsDOM(individualSavings) {
        const actionItems = document.querySelectorAll('.action-item');
        actionItems.forEach(item => {
            const checkbox = item.querySelector('.action-toggle');
            const id = checkbox.id.replace('action-', '');
            const val = individualSavings[id] || 0;

            const savingLabel = item.querySelector('.saving-value');
            savingLabel.textContent = `-${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} t`;
            
            item.classList.toggle('active', checkbox.checked);
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        let activeTheme = 'dark';
        
        if (savedTheme) activeTheme = savedTheme;
        else if (systemPrefersLight) activeTheme = 'light';

        document.documentElement.setAttribute('data-theme', activeTheme);

        this.themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// ============================================================================
// 8. APP COORDINATOR (DIP & BOOTSTRAPPING)
// ============================================================================

/**
 * App (Bootstraps the services, wires dependencies, and launches the UIController)
 * Dynamic storage provider selector logic handles network offline fallbacks gracefully.
 */
class App {
    async run() {
        let storage;
        const notifier = new ToastNotifier();

        try {
            // Check if backend API server is reachable
            const isLocalFile = window.location.protocol === 'file:';
            const pingUrl = isLocalFile ? 'http://localhost:5000/api/ping' : '/api/ping';
            const apiBase = isLocalFile ? 'http://localhost:5000' : '';

            const pingPromise = fetch(pingUrl, { method: 'GET' });
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500));
            
            const res = await Promise.race([pingPromise, timeoutPromise]);
            const statusData = await res.json();

            if (statusData.success && statusData.status === 'ok') {
                storage = new MongoApiStorageProvider(apiBase);
                console.log("EcoTrack connected to MongoDB API backend.");
            } else {
                throw new Error("API Offline");
            }
        } catch (err) {
            storage = new LocalStorageProvider();
            console.log("EcoTrack backend offline. Falling back to LocalStorage.");
        }

        const auth = new AuthManager(storage);

        const calculator = new CarbonCalculator([
            new EnergyCategory(),
            new TransportCategory(),
            new DietCategory(),
            new WasteCategory()
        ]);

        const actionsManager = new ActionPlanManager();

        const ui = new UIController(calculator, auth, actionsManager, notifier);
        ui.initialize();

        const hasSession = await auth.restoreSession();
        ui.showScreenForUser(auth.getCurrentUser());

        if (storage instanceof MongoApiStorageProvider) {
            notifier.info("Connected to MongoDB Database Server 🗄️");
        } else {
            notifier.info("Running offline mode (LocalStorage) 💾");
        }

        if (hasSession && auth.getCurrentUser()) {
            notifier.success(`Restored session for ${auth.getCurrentUser().username}.`);
        }
    }
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.run();
});
