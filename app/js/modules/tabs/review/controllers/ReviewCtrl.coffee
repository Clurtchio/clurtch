angular.module('app.modules.tabs.review.controllers', [])

.service 'CreateReview', ()->
  review = {}

  get: (key)->
    if key then return review[key]
    review
  set: (key, val)->
    review[key] = val

.controller 'ReviewCtrl', [
  '$scope'
  'CreateReview'
  'Menu'
  ($scope, CreateReview, Menu)->
    # window.currLocation from the background Geo Location
    $scope.locate = window.currLocation.coords

    # set the data to pass into the Menu Service
    #  Menu service takes (data, callback, searchValue)
    LocationData = {lat: $scope.locate.latitude,lng: $scope.locate.longitude}
    Menu.getByLocation(LocationData, (newData, key)->
      console.log newData
      $scope.nearbyFilter = key
      $scope.menus = newData
    )
    $scope.newSearch = (nearbyFilter)->
      # in order to reset the cache filter
      # set the search filter to "empty" if empty
      nearbyFilter = nearbyFilter or "empty"

      Menu.getByLocation(LocationData, (newData, key)->
        $scope.nearbyFilter = key
        $scope.menus = newData
      , nearbyFilter)
]

.controller 'ReviewItemCtrl', [
  '$scope'
  'CreateReview'
  'MenuItem'
  '$stateParams'
  ($scope, CreateReview, MenuItem, $stateParams)->
    $scope.menu_id = $stateParams.menu_id
    CreateReview.set('menu', $scope.menu_id)
    $scope.review = CreateReview.get()
    Menu.find($scope.menuId)
      .success((data) ->
        console.log "neo----", data[0][1]
        $scope.menu = data[0][0]
        if Array.isArray(data[0][1])
          $scope.items = data[0][1]
          console.log $scope.items
        else
          $scope.items.push(data[0][1])
          # $scope.$apply()
        $ionicLoading.hide()
      )

]

.controller 'createItemCtrl', [
  '$scope'
  'CreateReview'
  ($scope, CreateReview)->

]
.controller 'createReviewCtrl', [
  '$scope'
  'CreateReview'
  '$stateParams'
  'MenuItem'
  'Menu'
  'Review'
  'ServerUrl'
  ($scope, CreateReview, $stateParams, MenuItem, Menu, Review, ServerUrl)->
    $scope.itemId = $stateParams.itemId
    CreateReview.set('item_id', $scope.itemId)
    $scope.review = CreateReview.get()
    Menu.find(CreateReview.get('menu'))
      .success (data)->
        $scope.menu = data
    MenuItem.find($scope.itemId)
      .success (data)->
        $scope.item = data

    $scope.rating = 0
    $scope.buttons = [1,2,3,4,5]
    $scope.setRate = (index)->
      if $scope.rating is index then $scope.rating = 0 else $scope.rating = index
      CreateReview.set('rating', $scope.rating)

    $scope.submitReview = ->
      imgUrl = CreateReview.get('image_url')
      # imgUrl = imgUrl.toURL()
      # Review.create(CreateReview.get())
      win = (r)->
        console.log("Code = " + r.responseCode)
        console.log("Response = " + r.response)
        # console.log("Sent = " + r.bytesSent)


      fail = (error)->
        alert("An error has occurred: Code = " + error.code)
        console.log("upload error source " + error.source)
        console.log("upload error target " + error.target)


      options = new FileUploadOptions()
      options.fileKey = "image_url"
      options.fileName = imgUrl.substr(imgUrl.lastIndexOf('/') + 1)
      options.chunkedMode = false
      # options.fileName = 'image.jpg'
      options.mimeType = "image/jpeg"
      # options.mimeType = "text/plain"

      params = {}
      params.menu = CreateReview.get('menu')
      params.rating = CreateReview.get('rating')
      # params.value2 = "param";

      options.params = params
      # console.log "Options", options

      ft = new FileTransfer()
      ft.upload(imgUrl, encodeURI('http://192.168.1.9:9000/api/reviews'), win, fail, options)
      # dd = new FileTransfer()
      # dd.upload(imgUrl, encodeURI('http://192.168.1.9:9000/api/reviews'), win, fail, options)
      # console.log CreateReview.get()
]

#
# $scope.submitReview = (imgUrl)->
#   # imgUrl = CreateReview.get('image_url')
#   # imgUrl = imgUrl.toURL()
#   # Review.create(CreateReview.get())
#   win = (r)->
#     console.log("Code = " + r.responseCode)
#     console.log("Response = " + r.response)
#     # console.log("Sent = " + r.bytesSent)
#
#
#   fail = (error)->
#     alert("An error has occurred: Code = " + error.code)
#     console.log("upload error source " + error.source)
#     console.log("upload error target " + error.target)
#
#
#   options = new FileUploadOptions()
#   options.fileKey = "image_url"
#   options.fileName = imgUrl.substr(imgUrl.lastIndexOf('/') + 1)
#   options.chunkedMode = false
#   # options.fileName = 'image.jpg'
#   # options.mimeType = "image/jpeg"
#   options.mimeType = "text/plain"
#
#   params =
#     val1: "some value"
#     val2: "some other value"
#
#   options.params = params
#   # params.menu = CreateReview.get('menu')
#   # params.rating = CreateReview.get('rating')
#   # params.value2 = "param";
#
#   options.params = params
#   console.log "Options", options
#
#   ft = new FileTransfer()
#   ft.upload(imgUrl, 'http://192.168.1.9:9000/api/reviews', win, fail, options)
#   dd = new FileTransfer()
#   dd.upload(imgUrl, encodeURI('http://192.168.1.9:9000/api/reviews'), win, fail, options)
