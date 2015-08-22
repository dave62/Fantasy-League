'use strict';

angular.module('fantasyleagueApp')
    .controller('DraftController', function ($scope, $filter, Player, ParseLinks) {
    	
        $scope.sortingOrder = 'name';
        $scope.pageSizes = [5,10,25,50];
        $scope.reverse = false;
        $scope.filteredItems = [];
        $scope.groupedItems = [];
        $scope.itemsPerPage = 10;
        $scope.pagedItems = [];
        $scope.currentPage = 0;
        $scope.items = [];
        
        $scope.selectedGK = [];
        $scope.selectedDef = [];
        $scope.selectedMid = [];
        $scope.selectedFwd = [];
        
        $scope.messages = [];
        
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
        
        $scope.sort_by = function(newSortingOrder) {
          if ($scope.sortingOrder == newSortingOrder)
            $scope.reverse = !$scope.reverse;
          
          $scope.sortingOrder = newSortingOrder;
        };
        
        $scope.selectItem = function (idx) {
        	//getting the selected object
            var itemToSelect = $scope.pagedItems[$scope.currentPage][idx];
            
            //adding them to the right array
            switch (itemToSelect.position) {
			case 'G':
				$scope.selectedGK.push(itemToSelect);
				break;
			case 'D':
				$scope.selectedDef.push(itemToSelect);
				break;
			case 'M':
				$scope.selectedMid.push(itemToSelect);
				break;
			case 'A':
				$scope.selectedFwd.push(itemToSelect);
				break;
			default:
				break;
			}
            
            //then delete it from the main list
            var idxInItems = $scope.items.indexOf(itemToSelect);
            $scope.items.splice(idxInItems,1);
            $scope.search();
            
            return false;
        };
        
        $scope.sendMessage = function () {
        	if ($scope.currentMessage !== "") {
	        	var newMessage = {content:$scope.currentMessage, date:new Date(), author:"Author"}; 
	        	$scope.messages.push(newMessage);
	        	$scope.currentMessage = "";
	        	$('.panel-body').stop().animate({
        		  scrollTop: $(".panel-body")[0].scrollHeight
        		}, 800);
        	}
        }
        
        
        
        $scope.loadAll();

    });
