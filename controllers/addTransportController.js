var addTransportController = angular.module('addTransportController', ['citiesFactory', 'preferencesFactory', 'transportFactory']);
addTransportController.controller('AddTransportController', [ '$scope', 'Urls', 'Cities', 'Preferences', '$http', 'Transport', '$rootScope', '$location',
    function ($scope, Urls, Cities, Preferences, $http, Transport, $rootScope, $location) {
        $scope.preferencesLoaded = false;
        $scope.citiesLoaded = false;

        Cities.getCities().then(function (response) {
            if (response.status == 200) {
                $scope.cities = response.data.cities;
                $scope.citiesLoaded = true;
            }
            else {
                alert("Wystąpił problem połączenia z serwerem.\n Spróbuj ponownie za chwilę.")
            }
        });

        Preferences.getPreferences().then(function (response) {
            if (response.status == 200) {
                $scope.preferences = response.data.preferences;
                $scope.preferencesLoaded = true;
            }
            else {
                alert("Wystąpił problem połączenia z serwerem.\n Spróbuj ponownie za chwilę.")
            }
        });

        $('#departureDate').on('apply.daterangepicker', function(ev, picker) {
        }).daterangepicker(
            {
                singleDatePicker : true,
                timePicker : true,
                timePickerIncrement : 15,
                timePicker12Hour : false,
                showDropdowns : true,
                format : "MM-DD-YYYY HH:mm",
                locale: {
                    applyLabel: 'Wybierz',
                    cancelLabel: 'Wyczyść',
                    fromLabel: 'Od',
                    toLabel: 'Do',
                    daysOfWeek: ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'],
                    monthNames: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
                    firstDay: 1
                }
            }
        );

        $scope.isDateValid = function() {
            return ((new Date() >= new Date($scope.transport.departureDate)) && ($scope.addTransportForm.departureDate.$dirty));
        };

        $scope.selection = [];

        $scope.preferencesSelected = false;

        $scope.toggleSelection = function toggleSelection(preference) {
            var idx = $scope.selection.indexOf(preference);

            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }
            else {
                $scope.selection.push(preference);
            }

            if($scope.selection.length == 0) {
                $scope.preferencesSelected = false;
            }
            else {
                $scope.preferencesSelected = true;
            }
        };

        $scope.points=1;
        $scope.addPoint = function(num) {
            if ($scope.points < num) {
                $scope.points = num;
            }
        };

        $scope.transport = { };
        $scope.routes = {
            point0 : null,
            point1 : null,
            point2 : null,
            point3 : null,
            point4 : null,
            point5 : null,
            point6 : null,
            point7 : null
        };

        $scope.parseRoutes = function(){
            return $scope.parsedRoutes = [$scope.routes.point0, $scope.routes.point1, $scope.routes.point2, $scope.routes.point3, $scope.routes.point4, $scope.routes.point5, $scope.routes.point6, $scope.routes.point7];
        };

        $scope.addTransport = function() {
            console.log($scope.selection.length);
            if (!$scope.preferencesSelected) {
                $scope.choosePreference = true;
            }
            else {
                $scope.transport.departureDate = new Date($scope.departureDate);
                $scope.transport.userId = $rootScope.loggedUser.id;
                $scope.transport.preferences = $scope.selection;
                $scope.transport.cities = $scope.parseRoutes();


                Transport.addTransport($scope.transport).then(function(response) {
                    if(response.status == 200) {
                        $location.path('/my-transports/');
                    }
                    else {
                        alert("Wystąpił problem z serwerem. Przejazdu nie dodano! \n Spróbuj ponownie za chwilę.");
                    }
                });
            }
        }
    }]);