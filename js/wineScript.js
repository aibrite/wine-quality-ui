//import {featureSet} from "featureSet.js"
(function () {
    var featureSet = [];
    var featureData = {};
    var sliders = [];
    var container;
    var friendlyName = ['fixed acidity','volatile acidity','citric acid','residual sugar','chlorides','free sulfur dioxide','density','pH','total sulfur dioxide','sulphates','alcohol'];
    var initialData = [7.4 , 0.7 , 0.03 , 1.9 , 0.076 , 11 , 34 , 0.9978 , 3.51 , 0.56 , 9.4];
    var minData = [4.6, 0.12 , 0, 0.9 , 0.012 , 1 , 6 , 0.99007, 2.74 , 0.33 , 8.4];
    var maxData = [15.9, 1.58, 1, 15.5, 0.611 , 72, 289,1.00369, 4.01 , 2, 14.9];

    for (var i = 0; i < 11; i++) {
        featureSet.push({
            min: minData[i],
            max: maxData[i],
            step: 0.0001,
            name: 'alchohol' + i,
            friendlyName: friendlyName[i],
            unit: Math.random() > 0.5 ? 'ml' : '%',
            initialValue: 0.4 + (i / 100)
        });

        featureData["alchohol" + i] = initialData[i];

    }

    document.addEventListener('DOMContentLoaded', function () {
        $('#input-1').rating({min: 0, max: 10, step: 0.1, stars: 10});
        $('#input-2').rating({displayOnly: true, step: 0.1, stars: 10});
        container = document.querySelector('.sliders');
        createFatureEditors();
    });

    var logToConsole = debounce(function () {
        console.log(featureData);
    }, 2000, false)

    $('#input-1').on('rating.loading', function(event, value, caption) {
    console.log(value);
    });

    function createFatureEditors() {
        var sliderContainerTemplate = document.body.querySelector('#slider-template');
        featureSet.forEach(function (feature) {
            var featureEditor = document.createElement('input');
            featureEditor.type = 'range';
            featureEditor.min = feature.min;
            featureEditor.max = feature.max;
            featureEditor.step = feature.step;
            featureEditor.value = feature.initialValue;

            var sliderContainer = document.importNode(sliderContainerTemplate.content, true).querySelector('.cnt');
            sliderContainer.querySelector('.sliderContainer').appendChild(featureEditor);
            sliderContainer.querySelector('.footerText').innerHTML = feature.friendlyName;
            var headerText = sliderContainer.querySelector('.headerText');

            container.appendChild(sliderContainer);

            $(featureEditor).rangeslider({
                polyfill: false,
                orientation: 'vertical',
                onInit: function () {
                    this.boundProperty = feature.name;
                    this.setVal = function (value) {
                        setTimeout(function () {
                            this.$element.val(value).change();
                            this.$element.rangeslider('update', true);
                        }.bind(this))
                    }.bind(this);
                    this.setVal(featureData[this.boundProperty]);
                    sliders.push(this);
                },

                // Callback function
                onSlide: function (position, value) {
                    featureData[this.boundProperty] = value;
                    headerText.innerHTML = value + " " + feature.unit;
                },

                // Callback function
                onSlideEnd: function (position, value) {
                    logToConsole();
                }
            });
        });
    }

    function updateSliders(data) {
        data = data || featureData;
        sliders.forEach((slider) => {
            slider.setVal(data[slider.boundProperty]);
        });
    }

    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    window.wine = {
        update: updateSliders,
        data: featureData
    }

})();
