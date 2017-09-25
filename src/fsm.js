class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(config) {
            this._initialState = config.initial;
            this.state = this._initialState;
            this._statesHistory = [this._initialState];
            this._currentStateIndex = 0;
            this.states = config.states;
        } else {
          throw new Error('Config must be passed');
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(this.states[state]) {
            this.state = state;
            const countStatesToDelete = this._statesHistory.length - 1 - this._currentStateIndex;
            this._statesHistory.splice(this._currentStateIndex+1,  countStatesToDelete, state);
            this._currentStateIndex++;
        } else {
            throw new Error('There is no such state.');
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        const stateToEvent = this.states[this.state].transitions[event];
        if (stateToEvent) {
            this.changeState(stateToEvent);
        } else {
            throw new Error('Current state does not have such transition.');
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this._initialState);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        const allStates = Object.keys(this.states);
        if (event) {
            return allStates.filter(state => this.states[state].transitions[event]);
        } else {
            return allStates;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this._currentStateIndex > 0 && this._statesHistory.length) {
            this._currentStateIndex--;
            this.state = this._statesHistory[this._currentStateIndex];
            return true;
        } else {
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this._currentStateIndex < this._statesHistory.length-1) {
            this._currentStateIndex++;
            this.state = this._statesHistory[this._currentStateIndex];
            return true;
        } else {
            return false;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._statesHistory = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
