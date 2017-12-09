'use strict';
/* global angular */

var fazenda = angular.module('fazenda');

fazenda.directive('pageHeader', ['$rootScope', '$location',  function ( $rootScope, $location) {
    return {
        restrict: 'E',
        templateUrl:  'assets/directives/header.html',
        replace: true,
        link: function (scope, iElm, iAttrs, controller) {
        }
    };
}]);

fazenda.directive('pageFooter', ['$rootScope', '$location',  function ( $rootScope, $location) {
    return {
        restrict: 'E',
        templateUrl:  'assets/directives/footer.html',
        replace: true,
        link: function (scope, iElm, iAttrs, controller) {
        }
    };
}]);

fazenda.directive('starRating', function(){
    return {
        restrict: 'E',
        templateUrl:  'assets/directives/star-rating.html',
        replace: true,
        scope: { rating: '=' },
        link: function(scope, element, attrs){
            if (scope.rating) {
                scope.ratingCalculated = ((scope.rating*100)/5).toFixed(2);
            } else {
                scope.ratingCalculated = 0;
            }
        }
    };
});

fazenda.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});


fazenda.directive('modal', ['modalService', function (modalService) {
    return {
        link: function (scope, element, attrs) {
            // ensure id attribute exists
            if (!attrs.id) {
                console.error('modal must have an id');
                return;
            }

            // open modal
            function Open() {
                element.show();
                $('body').addClass('modal-open');
            }

            // close modal
            function Close() {
                element.hide();
                $('body').removeClass('modal-open');
            }

            // move element to bottom of page (just before </body>) so it can be displayed above everything else
            element.appendTo('body');

            // close modal on background click
            element.on('click', function (e) {
                var target = $(e.target);
                if (!target.closest('.modal-body').length) {
                    scope.$evalAsync(Close);
                }
            });


            // add self (this modal instance) to the modal service so it's accessible from controllers
            var modal = {
                id: attrs.id,
                open: Open,
                close: Close
            };

            modalService.Add(modal);

            // remove self from modal service when directive is destroyed
            scope.$on('$destroy', function() {
                modalService.Remove(attrs.id);
                element.remove();
            });


        }
    };
}]);
//Filters
fazenda.filter('phoneformat', function () {
    return function (phone) {
        if (!phone) { return ''; }

        var value = phone.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return phone;
        }

        var country, city, number;

        switch (value.length) {
            case 10:
                country = 55;
                city = value.slice(0, 2);
                number = value.slice(2);
                break;

            case 11:
                country = value[0];
                city = value.slice(1, 3);
                number = value.slice(3);
                break;

            case 12:
                country = value.slice(0, 2);
                city = value.slice(2, 4);
                number = value.slice(4);
                break;

            default:
                return phone;
        }

        number = number.slice(0, 4) + '-' + number.slice(4);

        return (country + " (" + city + ") " + number).trim();
    };
});

//services
fazenda.service('modalService', ['_',
    function(_) {
        var modals = []; // array of modals on the page
        var service = {};

        function Add(modal) {
            // add modal to array of active modals
            modals.push(modal);
        }

        function Remove(id) {
            // remove modal from array of active modals
            var modalToRemove = _.findWhere(modals, { id: id });
            modals = _.without(modals, modalToRemove);
        }

        function Open(id) {
            // open modal specified by id
            var modal = _.findWhere(modals, { id: id });
            modal.open();
        }

        function Close(id) {
            // close modal specified by id
            var modal = _.findWhere(modals, { id: id });
            modal.close();
        }

        service.Add = Add;
        service.Remove = Remove;
        service.Open = Open;
        service.Close = Close;

        return service;
}]);

fazenda.service('eventDispatcher', [
    function() {
        var eventSubscriptions = {};

        function Unsubscriber(eventName, callback) {
            this.destroy = function(){
                var subscribers = eventSubscriptions[eventName],
                    i;

                if (typeof subscribers === 'undefined') {
                    // No list found for this event, return early to abort execution
                    return;
                }

                for (i = subscribers.length - 1; i >= 0; i--) {
                    if (subscribers[i] === callback) {
                        subscribers.splice(i, 1);
                    }
                }
            };
        }

        var eventDispatcher = {
            subscribe: function(eventName, callback) {
                // Retrieve a list of current subscribers for eventName (if any)
                var subscribers = eventSubscriptions[eventName];

                if (typeof subscribers === 'undefined') {
                    // If no subscribers for this event were found,
                    // initialize a new empty array
                    subscribers = eventSubscriptions[eventName] = [];
                }

                // Add the given callback function to the end of the array with
                // eventSubscriptions for this event.
                subscribers.push(callback);
                return new Unsubscriber(eventName, callback);
            },

            unsubscribe: function(eventName, callback) {
                var subscribers = eventSubscriptions[eventName],
                    i;

                if (typeof subscribers === 'undefined') {
                    // No list found for this event, return early to abort execution
                    return;
                }

                for (i = subscribers.length - 1; i >= 0; i--) {
                    if (subscribers[i] === callback) {
                        subscribers.splice(i, 1);
                    }
                }
            },

            trigger: function(eventName, data, context) {
                var subscribers = eventSubscriptions[eventName],
                    i;

                if (typeof subscribers === 'undefined') {
                    // No list found for this event, return early to abort execution
                    return;
                }

                // Ensure data is an array or is wrapped in an array,
                // for Function.prototype.apply use
                data = (data instanceof Array) ? data : [data];

                // Set a default value for `this` in the callback
                context = context || this.caller;

                for (i = subscribers.length - 1; i >= 0; i--) {
                    subscribers[i].apply(context, data);
                }
            }
        };

        return eventDispatcher;

    }
]);
