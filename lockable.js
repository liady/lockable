(function ($, global, App){

	function Lockable() {
	    this.deferred = $.Deferred();
	    this.locks = {};
	}

	Lockable.prototype.lock = function (lockName) {
	    this.locks[lockName] = true;
	    return this;
	};

	Lockable.prototype.unlock = function (lockName) {
	    delete this.locks[lockName];
	    if (!this.hasLocks()) {
	        this.deferred.resolve();
	        this.reset();
	    }
	    return this;
	};

	Lockable.prototype.seal = function (errorMessage) {
	    this.deferred.reject(errorMessage);
	    this.locks[".seal"] = true;
	    return this;
	};

	Lockable.prototype.onOpen = function (successCallback) {
	    if(successCallback) {
	    	this.deferred.done(successCallback);
	    }

	    if (!this.hasLocks()) {
	        this.deferred.resolve();
	        this.reset();
	    }
	    return this;
	};

	Lockable.prototype.onSeal = function (failCallback){
	    if(failCallback){
	    	this.deferred.fail(failCallback);
	    }
	    return this;
	};

	Lockable.prototype.reset = function (){
	    this.deferred = $.Deferred();
	    this.locks = {};
	    return this;
	};

	Lockable.prototype.hasLocks = function () {
	    return !!Object.keys(this.locks).length;
	};

	Lockable.prototype.status = function () {
	    var self = this;
	    return {
	        isOpen : !self.hasLocks(),
	        isSealed : !!self.locks[".seal"],
	        locks : Object.keys(self.locks)
	    };
	};

	var lockables = {};

	var _api = {
			get : function (name) {
				if (!name)
					return new Lockable();

				lockables[name] = lockables[name] || new Lockable();
				return lockables[name];
			},
			remove : function (name) {
				lockables[name] = undefined;
			}
	};

	// hang on App
	App.lockables = _api;
	App.Lockable = _api.get;

}(jQuery, window, App = App || {}));