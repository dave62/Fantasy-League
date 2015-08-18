'use strict';

angular.module('fantasyleagueApp')
    .controller('DraftController', function ($scope, $filter, Player, ParseLinks) {
    	
        //New
        // init
        $scope.sortingOrder = 'name';
        $scope.pageSizes = [5,10,25,50];
        $scope.reverse = false;
        $scope.filteredItems = [];
        $scope.groupedItems = [];
        $scope.itemsPerPage = 10;
        $scope.pagedItems = [];
        $scope.currentPage = 0;
        $scope.items = [];
        
        $scope.loadAll = function() {
        	Player.query({}, function(result, headers) {
                $scope.items = result;
                $scope.search();
            });
        };

        var searchMatch = function (haystack, needle) {
          if (!needle) {
            return true;
          }
          return String(haystack).toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };
        
        // init the filtered items
        $scope.search = function () {
          $scope.filteredItems = $filter('filter')($scope.items, function (item) {
            for(var attr in item) {
              if (searchMatch(item[attr], $scope.query))
                return true;
            }
            return false;
          });
          // take care of the sorting order
          if ($scope.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
          }
          $scope.currentPage = 0;
          // now group by pages
          $scope.groupToPages();
        };
        
        // show items per page
        $scope.perPage = function () {
          $scope.groupToPages();
        };
        
        // calculate page in place
        $scope.groupToPages = function () {
          $scope.pagedItems = [];
          
          for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
              $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
              $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
          }
        };
        
        $scope.range = function (start, end) {
          var ret = [];
          if (!end) {
            end = start;
            start = 0;
          }
          for (var i = start; i < end; i++) {
            ret.push(i);
          }
          return ret;
        };
        
        $scope.prevPage = function () {
          if ($scope.currentPage > 0) {
            $scope.currentPage--;
          }
        };
        
        $scope.nextPage = function () {
          if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
          }
        };
        
        $scope.setPage = function () {
          $scope.currentPage = this.n;
        };
        
        // functions have been describe process the data for display
        
        // change sorting order
        $scope.sort_by = function(newSortingOrder) {
          if ($scope.sortingOrder == newSortingOrder)
            $scope.reverse = !$scope.reverse;
          
          $scope.sortingOrder = newSortingOrder;
        };
        
        
        $scope.loadAll();

    });
