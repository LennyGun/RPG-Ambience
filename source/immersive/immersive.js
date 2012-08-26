var ViewModel = function(editorWidth) {
	var self = this;
	
	self.start = function() {
		startAmbience();
		startInterface();
	}
	
	var ambience;
	function startAmbience() {
		ambience = new Ambience(
			new Ambience.Layer(document.getElementById('background')),
			new Ambience.Layer(document.getElementById('foreground'))
		);
	}
	
	var adventureFileInput = document.getElementById('adventure-file');
	self.adventureFileName = ko.observable('adventure.json');
	self.showAdventureSelector = function() {
		adventureFileInput.click();
	};
	
	self.readSelectedAdventure = function(viewModel, selectEvent) {
		var file = selectEvent.target.files[0];
		self.readAdventure(file);
	};
	
	self.readDroppedAdventure = function(viewModel, dropEvent) {
		var file = dropEvent.originalEvent.dataTransfer.files[0];
		self.readAdventure(file);
	};
	
	self.handleDrag = function(viewModel, dragEvent) {
		dragEvent.originalEvent.dataTransfer.dropEffect = 'copy';
	};
	
	self.readAdventure = function(file) {
		self.adventureFileName(file.name);
		
		var reader = new FileReader();
		reader.onload = function(loadEvent) {
			var config = JSON.parse(loadEvent.target.result);
			self.adventure.load(config);
			// This is so that the exit confirmation dialog will not show up when the user only loads an adventure.
			self.saveAdventure();
		};
		reader.readAsText(file);
	};
	
	self.latestAdventureString = ko.observable('');
	self.savedAdventureString = '';
	self.adventureUrl = ko.computed(function() {
		return 'data:application/json;base64,' + self.latestAdventureString();
	});
	
	self.saveAdventure = function() {
		self.serializeAdventure();
		self.savedAdventureString = self.latestAdventureString();
		return true;
	};
	
	self.serializeAdventure = function() {
		var state = {
			basePath: self.adventure.basePath(),
			scenes: self.adventure.scenes().map(function(scene) {
				return scene.copyState();
			})
		};
		var adventureJson = JSON.stringify(state);
		self.latestAdventureString(Base64.encode(adventureJson));
	};
	
	self.onExit = function() {
		self.serializeAdventure();
		if ( self.latestAdventureString() !== self.savedAdventureString ) {
			return 'There are unsaved changes in your adventure.';  				
		}
	};
	window.addEventListener('beforeunload', self.onExit);
	
	self.playScene = function(scene) {
		converted = self.adventure.convertScene(scene);
		ambience.play(converted);
	};
	
	self.playSelected = function() {
		self.playScene(self.adventure.current());
	};
	
	self.stopCurrent = function() {
		ambience.fadeOutTopmost();
	};
	
	function startInterface() {
		self.splitter = new Splitter(document.body, editorWidth);
		
		self.appIsRunLocally = window.location.protocol === 'file:';
		if ( self.appIsRunLocally ) {
			self.pathPlaceholder = 'File path or URL';
		} else {
			self.message('To access local files, <a href="">download RPG Ambience</a> and run it from your hard drive.');
			self.pathPlaceholder = 'URL';
		}
		
		document.addEventListener('keypress', self.onKeyPress);
		document.addEventListener('keydown', self.onKeyDown);
		
		var theaterForm = document.getElementById('theater-form');
		var showInterface = function(event) {
			event.stopPropagation();
			self.showInterface();
		};
		theaterForm.addEventListener('mousemove', showInterface);
		theaterForm.addEventListener('mouseover', showInterface);
		
		self.adventure = new AdventureViewModel(self);
	}
	
	self.message = ko.observable(null);
	self.clearMessage = function() {
		self.message(null);
	};
	
	self.instructionsAreVisible = ko.observable(true);
	self.hideInstructions = function() {
		self.instructionsAreVisible(false);
	};
	
	self.editorWidth = editorWidth;
	self.editorIsVisible = ko.observable(true);
	self.editorIsHidden = ko.computed(function() {
		return !self.editorIsVisible();
	});
	self.interfaceIsVisible = ko.observable(true);
	
	self.hideEditor = function() {
		self.editorWidth = self.splitter.leftWidth;
		self.editorIsVisible(false);
		self.splitter.update(0);
	};
	
	self.showEditor = function() {
		self.splitter.update(self.editorWidth);
		self.editorIsVisible(true);
	};
	
	var theater = document.getElementById('theater');
	var cursorTimer;
	var cursorHideDelay = 1000;
	var previousX;
	var previousY;
	
	self.hideInterface = function() {
		theater.style.cursor = 'none';
		self.interfaceIsVisible(false);
	};

	self.showInterface = function() {
		clearTimeout(cursorTimer);
		theater.style.cursor = 'auto';
		self.interfaceIsVisible(true);
	}
	
	self.scheduleHiddenInterface = function(viewModel, event) {
		// Setting the cursor style seems to trigger a mousemove event, so we have to make sure that the mouse has really moved or we will be stuck in an infinite loop.
		var mouseHasMoved = event.screenX !== previousX || event.screenY !== previousY;
		if ( mouseHasMoved ) {
			self.showInterface();
			cursorTimer = window.setTimeout(self.hideInterface, cursorHideDelay);
		}

		previousX = event.screenX;
		previousY = event.screenY;
	};
	
	self.stopPropagation = function(viewModel, event) {
		event.stopPropagation();
		return true;
	}
	
	self.onKeyDown = function(event) {
		var key = Key.name(event.keyCode);
		if ( self.commands[key]  ) {
			event.preventDefault();
			self.commands[key]();
		} else {
			var scene = self.adventure.keyedScene(key);
			if ( scene ) {
				event.preventDefault();
				self.playScene(scene);
			}
		}
	};
	
	self.sceneName = ko.observable('');
	self.onKeyPress = function(event) {
		// Firefox handles charCode 0 as a string so we guard against it here.
		if ( event.charCode !== 0 ) {
			var character = String.fromCharCode(event.charCode);
			var scene = self.adventure.keyedScene(character.toUpperCase());
			if ( scene ) {
				self.playScene(scene);
				self.sceneName('');
			} else if ( character ) {
				self.sceneName(self.sceneName() + character);
			}
		}
	};
	
	self.backspaceSceneName = function() {
		if ( self.sceneName().length > 0 ) {
			self.sceneName(self.sceneName().substring(0, self.sceneName().length - 1));
		}
	};
	
	self.playNamedScene = function() {
		if ( self.sceneName().length === 0 ) {
			ambience.fadeOutTopmost();
		} else {
			var scene = self.adventure.namedScene(self.sceneName());
			if ( scene ) {
				self.playScene(scene);
			}
			self.sceneName('');
		}
	};
	
	self.commands = {
		'Enter': self.playNamedScene,
		'Backspace': self.backspaceSceneName,
		'Escape': function() {}
	};
};

var viewModel;
window.addEventListener('load', function() {
	viewModel = new ViewModel(0.6);
	viewModel.start();
	ko.applyBindings(viewModel);
	viewModel.adventure.start();
	viewModel.serializeAdventure(); // This is so that the exit confirmation dialog will appear even when nothing has been done.
});