import {Inject, Injectable} from '@angular/core';

@Injectable()
export class UserCacheService{

    // Map to store data on
    private eeaUserCacheMap: any;
    private loginResponse:any;
	private userId:string;
	
    // Quick constructor for instantiating the cache map and loading from local storage
    constructor() {
      this.eeaUserCacheMap = {};
      this.loadFromLocalStorage();
    }

    /**
    * This function checks the local storage for any offloaded data for this cache.
    * This function is to ensure that refreshing the page will not ruin our chache.
    * TODO: Run tests to make sure cache isn't persisting too much that it impedes database changes.
    */
    loadFromLocalStorage() {
      var localUserCache = localStorage.getItem('localEEAUserCache');
      if(localUserCache != undefined && localUserCache != null) {
        this.eeaUserCacheMap = JSON.parse(localUserCache);
        localStorage.removeItem('localEEAUserCache');
      }
    }

    /**
    * Helper function that offloads data to the localStorage. This is triggered
    * on page refreshes to prevent the cache from breaking on refresh.
    */
    backupToLocalStorage() {
      localStorage.setItem('localEEAUserCache', JSON.stringify(this.eeaUserCacheMap));
    }

    /**
    * This function is used to get data from the cache.
    * @param key {String} - The map key that our desired data should be housed at
    */
    getUserData(key:string): any {
      return this.eeaUserCacheMap[key];
    }

    /**
    * This function is used to save data in the cache.
    * @param key {String} - The map key that our data should be housed at
    * @param data {any} - The data to save
    */
    setUserData(key: string, data: any): void {
      this.eeaUserCacheMap[key] = data;
    }

    /**
    * This function is used to erase data from the cache.
    * @param key {String} - The map key we should erase
    */
    eraseUserData(key: string):void {
      this.eeaUserCacheMap[key] = undefined;
    }

    /**
    * This function is used to erase ALL data from the cache.
    */
    eraseAllUserData():void {
      this.eeaUserCacheMap = {};
    }
	
   handleErr(msg:string,err:any){
       console.log("An error occurred calling the UserCacheService : ");
   }
   
}
