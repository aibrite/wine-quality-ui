//import {featureSet} from 'js/featureSet.js'
(function () {
    //var featureSet = [];
    var featureData = {};
    var sliders = [];
    var container;
    var rate;
    var featureSet = [{
        min: 4.6,
        max: 15.9,
        step: 0.0001,
        name: 'alcohol0',
        friendlyName: 'fixed acidity',
        unit: 'ml',
        initialValue: 7.4
    },
    {
        min: 0.12,
        max: 1.58,
        step: 0.0001,
        name: 'alcohol1',
        friendlyName: 'volatile acidity',
        unit: 'ml',
        initialValue: 0.7
    },
    {
        min: 0,
        max: 1,
        step: 0.0001,
        name: 'alcohol2',
        friendlyName: 'citric acid',
        unit: 'ml',
        initialValue: 0.03
    },
    {
        min: 0.9,
        max: 15.5,
        step: 0.0001,
        name: 'alcohol3',
        friendlyName: 'residual sugar',
        unit: 'ml',
        initialValue: 1.9
    },
    {
        min: 0.012,
        max: 0.611,
        step: 0.0001,
        name: 'alcohol4',
        friendlyName: 'chlorides',
        unit: '%',
        initialValue: 0.076
    },
    {
        min: 1,
        max: 72,
        step: 0.0001,
        name: 'alcohol5',
        friendlyName: 'free sulfur dioxide',
        unit: '%',
        initialValue: 11
    },
    {
        min: 6,
        max: 289,
        step: 0.0001,
        name: 'alcohol6',
        friendlyName: 'density',
        unit: '%',
        initialValue: 34
    },
    {
        min: 0.99007,
        max: 1.00369,
        step: 0.0001,
        name: 'alcohol7',
        friendlyName: 'pH',
        unit: 'ml',
        initialValue: 0.9978
    },
    {
        min: 2.74,
        max: 4.01,
        step: 0.01,
        name: 'alcohol8',
        friendlyName: 'total sulfur dioxid',
        unit: '%',
        initialValue: 3.51
    },
    {
        min: 0.33,
        max: 2,
        step: 0.0001,
        name: 'alcohol9',
        friendlyName: 'sulphates',
        unit: 'ml',
        initialValue: 0.56
    },
    {
        min: 8.4,
        max: 21,
        step: 0.0001,
        name: 'alcohol10',
        friendlyName: 'alcohol',
        unit: '%',
        initialValue: 9.4
    }]
    // var friendlyName = ['fixed acidity','volatile acidity','citric acid','residual sugar','chlorides','free sulfur dioxide','density','pH','total sulfur dioxid','sulphates','alcohol'];
    // var initialData = [7.4 , 0.7 , 0.03 , 1.9 , 0.076 , 11 , 34 , 0.9978 , 3.51 , 0.56 , 9.4];
    // var minData = [4.6, 0.12 , 0, 0.9 , 0.012 , 1 , 6 , 0.99007, 2.74 , 0.33 , 8.4];
    // var maxData = [15.9, 1.58, 1, 15.5, 0.611 , 72, 289,1.00369, 4.01 , 2, 14.9];

    for (var i = 0; i < 11; i++) {
        // featureSet.push({
        //     min: minData[i],
        //     max: maxData[i],
        //     step: 0.0001,
        //     name: 'alchohol' + i,
        //     friendlyName: friendlyName[i],
        //     unit: Math.random() > 0.5 ? 'ml' : '%',
        //     initialValue: 0.4 + (i / 100)
        // });

        featureData["alcohol" + i] = featureSet[i].initialValue;

    }

    document.addEventListener('DOMContentLoaded', function () {
        $('#rateQuality').rating({ min: 0, max: 100, step: 1, stars: 5 });
        $('#estimateQuality').rating({ displayOnly: true, step: 0.1, stars: 5 });
        container = document.querySelector('.sliders');
        createFatureEditors();
        $("#rateQuality").rating().on("rating.clear", function (event) {
            console.log("Your rating is reset")
        }).on("rating.change", function (event, value, caption) {
            console.log("You rated: " + value + " = " + $(caption).text());
            rate = value;
        });
    });

    var logToConsole = debounce(function () {
        console.log(featureData);

        //Utku: JQuery Server Call 
        $.post('https://wine-quality.herokuapp.com/predict', featureData, function (data, status) {
            console.log('Posting...')
        }).done(function (data, status) {
            console.log(data)
            alert("Selected Wine Quality: " + data.prediction);
        }).fail(function (err) {
            console.log(err)
            alert('Error. Please try again.')
        })
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
