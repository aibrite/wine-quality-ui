(function () {
    var featureSet = [];
    var featureData = {};
    var sliders = [];
    var container;

    for (var i = 0; i < 13; i++) {
        featureSet.push({
            min: 0,
            max: 1,
            step: 0.0001,
            name: 'alchohol' + i,
            friendlyName: 'Alchohol' + i,
            unit: Math.random() > 0.5 ? 'ml' : '%',
            initialValue: 0.4 + (i / 100)
        });

        featureData["alchohol" + i] = 0.4 + (i / 100);

    }

    document.addEventListener('DOMContentLoaded', function () {
        container = document.querySelector('.sliders');
        createFatureEditors();
    });

    var logToConsole = debounce(function () {
        console.log(featureData);
    }, 2000, false)

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