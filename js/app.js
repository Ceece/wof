var app = angular.module('app', ['ngAudio']);
app.controller('wof', ['$scope','$timeout', 'ngAudio', function($scope, $timeout, ngAudio){
	$scope.accelerate = 5;
	$scope.rewards = [{
		name: '1',
		image: 'https://placehold.it/400?text=1'
	},{
		name: '2',
		image: 'https://placehold.it/400?text=2'
	},{
		name: '3',
		image: 'https://placehold.it/400?text=3'
	},{
		name: '4',
		image: 'https://placehold.it/400?text=4'
	},{
		name: '5',
		image: 'https://placehold.it/400?text=5'
	},{
		name: '6',
		image: 'https://placehold.it/400?text=6'
	},{
		name: '7',
		image: 'https://placehold.it/400?text=7'
	},{
		name: '8',
		image: 'https://placehold.it/400?text=8'
	},{
		name: '9',
		image: 'https://placehold.it/400?text=9'
	},{
		name: '10',
		image: 'https://placehold.it/400?text=10'
	},{
		name: '11',
		image: 'https://placehold.it/400?text=11'
	},{
		name: '12',
		image: 'https://placehold.it/400?text=12'
	}];

	$scope.number = Math.floor(Math.random() * $scope.rewards.length);

	$scope.delay = [];

	$scope.power = {
		power: 0,
		run: false,
		increase: 1,
		style: {
			"width": 0
		}
	}

	$scope.songs = [
	ngAudio.load('sounds/SG8_-_8-Punk.mp3'),
	ngAudio.load('sounds/Sunny-8-bit-style-music.mp3'),
	ngAudio.load('sounds/My-land-playful-synth-electro-track.mp3'),
	ngAudio.load('sounds/Drop-2-funky-lounge-pop-song.mp3')
	];

	$scope.spin = function() {
		var velocity = Math.floor(Math.random() * 10) + 30;
		console.log(velocity);
		var starting = $scope.calcDelay(0, velocity , $scope.accelerate * 5);
		var stoping = $scope.calcDelay(velocity, 0 , $scope.accelerate * -1);
		var delay = starting.concat(stoping);
		$scope.startSpin(delay);
	};

	$scope.increaseNumber = function() {
		$scope.number++;
		$scope.verifyNumber();
	}

	$scope.decreaseNumber = function() {
		$scope.number--;
		$scope.verifyNumber();
	}

	$scope.verifyNumber = function() {
		if ($scope.number > $scope.rewards.length - 1)
			$scope.number -= $scope.rewards.length;

		if ($scope.number < 0)
			$scope.number += $scope.rewards.length;
	}

	$scope.calcDelay = function(initialVelocity, velocity, accelerate) {
		var time = (velocity - initialVelocity) / accelerate;
		var distance = initialVelocity * time + accelerate * time * time / 2;
		var times = [], delay = [];
		for (var s = 0; s <= distance; s++) {
			a = accelerate / 2;
			b = initialVelocity;
			c = -1 * s;
			t = ((-1 * b) + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
			times.push(t * 1000);
			delay.push(t * 1000 - (times[s-1] || 0));
		};

		delay.shift();

		return delay;
	};

	$scope.spining = function () {
		$timeout(function() {
			if ($scope.stop) {
				$scope.stop = false;
			} else if ($scope.delay.length) {
				$scope.spining();
			} else {
				$scope.stopMusic(0.5);
			}
			$scope.increaseNumber();
			$scope.delay.shift();
		}, $scope.delay[0]);
	};

	$scope.startSpin = function(delay) {
		$scope.stopSpin();
		$scope.startMusic();
		$scope.delay = delay;
		$scope.spining();
	}

	$scope.stopSpin = function() {
		if ($scope.delay.length) {
			$scope.stop = true;
			$scope.delay = [];
			$scope.stopMusic();
		};
	}

	$scope.currentVelocity = function() {
		return $scope.delay == undefined || $scope.delay[0] == undefined || isNaN($scope.delay[0]) ? 0 : 1000 / $scope.delay[0];
	}

	$scope.powerStart = function() {
		$scope.stopSpin();
		$scope.power.power = 0;
		$scope.power.run = true;
		$scope.powerRun();
	}

	$scope.powerRun = function() {
		if ($scope.power.run) {
			$timeout(function() {
				if ($scope.power.power == 0) {
					$scope.power.increase = 1;
				};
				if ($scope.power.power == 100) {
					$scope.power.increase = -1;
				};
				$scope.power.power += $scope.power.increase;
				$scope.power.style = {
					"width": $scope.power.power+"%"
				}
				$scope.powerRun();
			}, Math.sqrt(100 - $scope.power.power) / 100);
		};
	}

	$scope.powerStop = function() {
		$scope.power.run = false;
		var velocity = (20 * $scope.power.power / 100) + 30;
		$scope.spin(velocity);
	};

	$scope.isSpinning = function() {
		return $scope.delay.length > 0;
	};

	$scope.startMusic = function() {
		var newSong = $scope.songs[Math.floor(Math.random() * $scope.songs.length)];
		
		if ($scope.music != undefined)
			$scope.music.stop();
		
		if ($scope.music != undefined && $scope.music.id == newSong.id) {
			return $scope.startMusic();
		} else {
			$scope.music = newSong;
		}
		
		$scope.music.setVolume(1);
		$scope.music.play();
		console.log($scope.music);
	};

	$scope.stopMusic = function(sec, vol, oldId) {
		var newId = $scope.music.id;
		var sec = sec || 0;
		var vol = vol || 1;

		if ($scope.music == undefined)
			return;

		if ( sec == 0 || vol < 0 ) {
			$scope.music.stop();
		} else if ( sec > 0 && (newId == oldId || oldId == undefined)) {
			$timeout(function() {
				$scope.music.setVolume(vol);
				$scope.stopMusic(sec, vol - 0.01, newId);
			}, 10 * sec);
		}
	};

}]);