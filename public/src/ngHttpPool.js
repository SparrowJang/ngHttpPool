
(function(){

  'use strict';

  var app = angular.module( "ngHttpPool", [] );

  /**
  * @param {function} callback
  * @param {Object} namespace
  */
  var proxy = function( callback, namespace ){

    return function(){

      var params = [];

      for ( var i in arguments ) params.push( arguments[i] );

      callback.apply( namespace, params );

    };

  };

  /**
  * @class
  * @constructor
  * @param {$http} $http
  * @param {$q} $q
  * @param {Number} total
  */
  var Pool = function( $http, $q, total ){

    this.$http_ = $http;
    this.$q_ = $q;
    this.total_ = total;
    this.processes_ = [];
    this.queue_ = [];
  };

  Pool.prototype = {

    /**
    * 
    */
    listen:function(){

      this.listenRequests_ = [];
    },

    /**
    * @param {Object} params
    * @param {function} callback
    * @param {function} error
    */
    map:function( params, success, error ){

      var deferred;

      if ( this.listenRequests_ ) {

        deferred = this.$q_.defer();

        this.listenRequests_.push( deferred.promise );
      }

      this.queue_.push({

        params:params,
        success:success,
        error:error,
        deferred:deferred
      });

      this.runNext_();
    },

    /**
    * @type {Promise} promise
    */
    getPromise:function(){

      var promise = this.$q_.all( this.listenRequests_ );

      this.listenRequests_ = null;

      return promise;
    },

    /**
    * @private
    */
    runNext_:function(){

      if ( ( this.total_ - this.processes_.length ) > 0 ) {

        var request = this.queue_.shift();

        if ( !request ) return;

        this.processes_.push( request );

        var http = this.$http_( request.params );

        if ( request.deferred ) {

          var deferred = request.deferred;

          //http.success( proxy( deferred.resolve, deferred ) );
          //http.error( proxy( deferred.reject, deferred ) );
          this.configurePromise_( http, deferred );
        }

        if ( request.success ) http.success( request.success );
        if ( request.error ) http.error( request.error );
        http.success( proxy( this.processComplete_, this ) )
        http.error( proxy( this.processComplete_, this ) )
      }
    },

    /**
    * 
    */
    configurePromise_:function( http, deferred ){

      var adapter = function( result, status, headers, config ){

        return {
          data:result,
          status:status,
          headers:headers,
          config:config
        };

      };

      http.success(function( result, status, headers, config ){

        deferred.resolve( adapter( result, status, headers, config ) );
      });

      http.error(function( result, status, headers, config ){

        deferred.reject( adapter( result, status, headers, config ) );
      });


    },

    /**
    * @private
    */
    processComplete_:function(){

      this.processes_.shift();
      this.runNext_();
    }
  };

  app.factory( 'httpPool', [ '$http', '$q', function( $http, $q ){


    return {

      /**
      * @param {Number} total
      * @type Pool
      */
      create:function( total ){

        return new Pool( $http, $q, total );
      }
    };

  }]);

})();

