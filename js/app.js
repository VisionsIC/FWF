/**
 * Created by Aaron Wilson on 10/02/2015.
 */
var app = angular.module('aarons_gla', ["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider
        .when("/",{
            templateUrl: "views/aaronglapp_glist.html",
            controller: "index_cntrl"
        })
        .when("/aaronglapp_add",{
            templateUrl: "views/aaronglapp_add.html",
            controller: "gla_item_cntrl"
        })
        .when('/aaronglapp_add/edit/:id',{
            templateUrl: 'views/aaronglapp_add.html',
            controller: 'gla_item_cntrl'
        })
        .otherwise({
            redirectTo: "/"
        })
});

app.service("aarons_gla_service", function(){

    var aarons_gla_service = {};

    aarons_gla_service.groceryItems = [

    ];


    aarons_gla_service.findById = function(id){
        for(var item in aarons_gla_service.groceryItems){
            if(aarons_gla_service.groceryItems[item].id === id) {
                console.log(aarons_gla_service.groceryItems[item]);
                return aarons_gla_service.groceryItems[item];
            }
        }
    };

    aarons_gla_service.getNewId = function(){

        if(aarons_gla_service.newId){
            aarons_gla_service.newId++;
            return aarons_gla_service.newId;
        }else{
            var max_item_id = _.max(aarons_gla_service.groceryItems, function(entry){ return entry.id;});
            aarons_gla_service.newId = max_item_id.id + 1;
            return aarons_gla_service.newId;
        }
    };

    aarons_gla_service.markCompleted = function(entry){
        entry.completed = !entry.completed;
    };

    aarons_gla_service.removeItem = function(entry){
        var aarons_gla_index = aarons_gla_service.groceryItems.indexOf(entry);

        aarons_gla_service.groceryItems.splice(aarons_gla_index, 1);
    };

    aarons_gla_service.save = function(entry) {

        var updated_gli = aarons_gla_service.findById(entry.id);

        if(updated_gli){

            updated_gli.completed = entry.completed;
            updated_gli.itemName = entry.itemName;
            updated_gli.date = entry.date;

        }else {
            entry.id = aarons_gla_service.getNewId();
            aarons_gla_service.groceryItems.push(entry);
        }

    };

    return aarons_gla_service;

});

app.controller("index_cntrl", ["$scope", "aarons_gla_service", function($scope, aarons_gla_service) {

    $scope.groceryItems = aarons_gla_service.groceryItems;

    $scope.removeItem = function(entry){
        aarons_gla_service.removeItem(entry);
    };

    $scope.markCompleted = function(entry){
        aarons_gla_service.markCompleted(entry);
    };

}]);

app.controller("gla_item_cntrl", ["$scope", "$routeParams", "$location", "aarons_gla_service", function($scope, $routeParams, $location, aarons_gla_service){

    if(!$routeParams.id) {
        $scope.groceryItem = {id: 0, completed: false, itemName: "", date: new Date()};
    }else{
        $scope.groceryItem = _.clone(aarons_gla_service.findById(parseInt($routeParams.id)));
    }


    $scope.save = function(){
        aarons_gla_service.save( $scope.groceryItem );
        $location.path("/");
    };

}]);

app.directive("tbGroceryItem", function(){
    return{
        restrict: "E",
        templateUrl: "views/aaronglapp_glitem.html"
    }
});