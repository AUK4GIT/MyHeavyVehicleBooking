import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AppModelServiceProvider {

  currentUser: AppUser;
  users: AppUser[];
  trucks: AppTruck[];
  trucktypes: AppTruckType[];
  trips: AppTrip[];
  offers: AppOffer[];
  quotations: AppQuotation[];
  predefinedlistofplaces: AppCity[];
  header: any;
  customTripCreated: any;

  // status: pending, approved, rejected
  constructor(public http: HttpClient, public events: Events) {
    console.log('Hello AppModelServiceProvider Provider');
    let lang = localStorage.getItem("lang") ? localStorage.getItem("lang") : "en";
    let langtr = (lang == "en") ? "en" : "sa";
    this.header = { "headers": { "Content-Type": "application/json", "lang": langtr } };
    this.getCurrentUser();

    this.predefinedlistofplaces = [];
    this.users = [new AppUser("admin1", "admin1@gmail.com", "admin", "1234567890", "admin", "1", "pending", ""),
    new AppUser("admin2", "admin2@gmail.com", "admin", "1234567890", "admin", "2", "pending", ""),
    new AppUser("driver1", "driver1@gmail.com", "driver", "1234567890", "driver", "3", "pending", "5"),
    new AppUser("driver2", "driver2@gmail.com", "driver", "1234567890", "driver", "4", "pending", "6"),
    new AppUser("owner1", "owner1@gmail.com", "owner", "1234567890", "owner", "5", "pending", ""),
    new AppUser("owner2", "owner2@gmail.com", "owner", "1234567890", "owner", "6", "pending", ""),
    new AppUser("customer1", "customer1@gmail.com", "customer", "1234567890", "customer", "7", "pending", ""),
    new AppUser("customer2", "customer2@gmail.com", "customer", "1234567890", "customer", "8", "pending", "")];

    this.trucktypes = [new AppTruckType("1", "Flatbed", ""),
    new AppTruckType("2", "Lowbed", ""),
    new AppTruckType("3", "Curtainside", ""),
    new AppTruckType("4", "Reefer", ""),
    new AppTruckType("5", "Car Transporter", ""),
    new AppTruckType("6", "Tipper", ""),
    new AppTruckType("7", "Tanker", ""),
    new AppTruckType("8", "Container", "")];

    // this.trucks = new Array<AppTruck>();

    // this.trips = new Array<AppTrip>();
    // this.quotations = new Array<AppQuotation>(); 

    this.trucks = [new AppTruck("Flatbed", "2000 cc", "SA15A6600", null, "0", "5", "pending", "1", "red", "12/12/2016", "1"),
    new AppTruck("Lowbed", "2200 cc", "SA15A5500", null, "0", "5", "pending", "2", "gren", "12/12/2016", "2")];

    this.quotations = [new AppQuotation("", "", "12", "1500", "pending", "", "", "", "", "", "", "1", "1", "5", "owner1", ""),
    new AppQuotation("", "", "15", "2000", "pending", "", "", "", "", "", "", "2", "2", "5", "owner1", "")];

    this.trips = [new AppTrip("", "Flatbed", "Jedda", "Mecca", "pending", "", "", "1", "", "5", "", "0", "true", "1", "", "1200", "15", ""),
    new AppTrip("", "Lowbed", "Medina", "Mecca", "pending", "", "", "2", "", "5", "", "0", "true", "2", "", "1800", "25", "")];

    this.offers = [new AppOffer("1", "Promotional Offer", "1", "1", "Flatbed", "Jedda", "Mecca", "", "15", "12/12/2017", "29/12/2017", "pending", "5"),
    new AppOffer("2", "Promotional Offer", "2", "2", "Lowbed", "Jedda", "Mecca", "", "20", "12/12/2017", "29/12/2017", "pending", "5")];

    this.events.subscribe('language:changed', (lang) => {
      let langtr = "en";
      if(lang == "english"){
        langtr = "en";
      } else {
        langtr = "sa";
      }
      let head = this.header["headers"];
      head.lang = langtr;
      this.header["headers"] = head;
    });
  }

  setCurrentUser(item) {
    this.currentUser = new AppUser(item.name, item.email, item.password, item.phonenumber, item.role, item.userid, item.status, item.ownerid)
    localStorage.setItem("user", JSON.stringify(this.currentUser));
  }

  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    } else {
      let user = localStorage.getItem("user");
      if (user) {
        this.currentUser = JSON.parse(user);
        return this.currentUser;
      } else {
        return null;
      }
    }
  }

  addUser(item, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/user/create',
      item, this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["message"]) {
          let msg = response["message"];
          callback({ result: 'success', message: msg });
        } else {
          callback({ result: 'failure', error: "Unkown error." });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
    // return this.users[this.users.push(
    //   new AppUser(item.name, item.email, item.password, item.phonenumber, item.role, String(this.users.length+1), item.status, item.ownerid)
    // )-1];
  }

  loginService(item, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/login',
      {
        username: item.email,
        password: item.password,
        token: localStorage.getItem("fcmtoken"),
        platform: localStorage.getItem("platform")
      }, this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          let data = response["data"];
          callback({ result: 'success', data: data });
        } else {
          callback({ result: 'failure', error: "Unkown error." });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
    /*
    let users = this.users.filter((user: AppUser) => user.email == item.email);
    if(users.length > 0){
      let user = users[0];
      if(user.password == item.password) {
        callback({result: 'success', data: users[0]});        
      } else {
        callback({result: 'failure', error: "Invalid password"}); 
      }
    } else {
      callback({result: 'failure', error: "User doesn't exist. Please register."});       
    }
    */
  }

  resetPwdService(item, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/resetpassword',
      {
        username: item.email,
        oldpassword: item.oldpassword,
        newpassword: item.newpassword
      }, this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          let data = response["data"];
          callback({ result: 'success', data: data });
        } else {
          callback({ result: 'failure', error: "Unkown error." });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
  }

  registrationService(item, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/user/create',
      {
        role: item.role,
        name: item.name,
        phonenumber: item.phonenumber,
        email: item.email,
        password: item.password,
        status: item.status,
        token: localStorage.getItem("fcmtoken"),
        platform: localStorage.getItem("platform"),
        imagedata: item.imagedata
      }, this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["message"]) {
          let msg = response["message"];
          callback({ result: 'success', message: msg });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
  }

  updateprofile(profile, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/user/updateprofile',
      profile, this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["message"]) {
          let msg = response["message"];
          callback({ result: 'success', message: msg });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
  }

  getUsersByRole(role, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/get/usersbyrole', { role: role },
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
    // let users = this.users.filter((user: AppUser) => user.role == role);
    // return <any>users;
  }

  getUserById(userid, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/get/usersbyid', { userid: userid },
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
    // let users = this.users.filter((user: AppUser) => user.userid == userid);
    // if(users.length > 0){
    //   return users[0];
    // } else {
    //   return null;
    // }
  }

  getDriversForOwner(ownerid, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/get/driversforowner', { ownerid: ownerid },
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
    // let users = this.users.filter((user: AppUser) => user.owneridfordriver == ownerid);
    // return <any>users;
  }

  getTruckTypes(callback) {
    // return this.trucktypes;
    this.http.get('http://zamilrenttruck.com/api.php/get/trucktypes',
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
  }

  getPlaces(callback) {
    // return this.trucktypes;
    this.http.get('http://zamilrenttruck.com/api.php/get/places',
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
  }

  getTruckTypesAndPlaces(callback) {
    // return this.trucktypes;
    this.http.get('http://zamilrenttruck.com/api.php/get/trucksplaces',
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
  }

  getTrucks(callback) {
    // return this.trucks;
    this.http.get('http://zamilrenttruck.com/api.php/get/trucks',
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
  }

  getTrucksForOwnerid(ownerid, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/get/truckbyownerid', { ownerid: ownerid },
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
    // let trucks = this.trucks.filter((truck: AppTruck) => truck.ownerid == ownerid);    
    // return trucks;
  }

  getTruckForTruckId(truckid, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/get/truckbytruckid', { truckid: truckid },
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
    // let trucks = this.trucks.filter((truck: AppTruck) => truck.truckid == truckid);    
    // return trucks.length > 0 ? trucks[0] : null;
  }

  getTrips(callback) {
    // return this.trips;

    this.http.get('http://zamilrenttruck.com/api.php/get/trips',
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
  }

  getTripsForCustomerid(userid, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/get/tripsforuserid', { userid: userid },
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });

    // let trips = this.trips.filter((trip: AppTrip) => ((trip.userid == userid) && (trip.status != 'completed')));    
    // return trips;
  }

  getTripsForOwnerId(userid, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/get/tripsforownerid', { userid: userid },
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });

    // let trips = this.trips.filter((trip: AppTrip) => ((trip.userid == userid) && (trip.status != 'completed')));    
    // return trips;
  }

  getPredefinedTripsForOwnerId(userid, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/get/pretripsforownerid', { userid: userid },
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });

    // let trips = this.trips.filter((trip: AppTrip) => ((trip.userid == userid) && (trip.status != 'completed')));    
    // return trips;
  }

  getAllTripsForId(userid, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/get/alltripsforuserid', { userid: userid },
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });

    // let trips = this.trips.filter((trip: AppTrip) => ((trip.userid == userid) && (trip.status != 'completed')));    
    // return trips;
  }


  getCustomPendingTrips(callback) {

    this.http.get('http://zamilrenttruck.com/api.php/get/custompendingtrips',
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });

    // let trips = this.trips.filter((trip: AppTrip) => (((trip.status == "pending") || (trip.status == "requested")) && (trip.ispredefined == "false")));    
    // return trips;
  }

  getAvailableTrips(callback) {

    this.http.get('http://zamilrenttruck.com/api.php/get/predefinedtrips',
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });

    // let trips = this.trips.filter((trip: AppTrip) => trip.ispredefined == 'true');    
    // return trips;
  }

  getOwnerAvailableTrips(userid, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/get/predefinedtripsforuserid', { userid: userid },
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });

    // let trips = this.trips.filter((trip: AppTrip) => (trip.ispredefined == 'true' && trip.userid == userid));    
    // return trips;
  }

  getRequestedTripsForOwnerid(userid, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/get/requestedtripsforownerid', { userid: userid },
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });

    // let trips = this.trips.filter((trip: AppTrip) => (trip.ispredefined == 'false' && trip.ownerid == userid));    
    // return trips;
  }

  getConfirmedTripsforDriverId(userid, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/get/confirmedtripsfordriverid', { userid: userid },
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["data"]) {
          callback({ result: 'success', data: response["data"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
  }

  getOffers(callback) {
    this.http.get('http://zamilrenttruck.com/api.php/get/offers', this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["data"]) {
        let offers = response["data"];
        callback({ result: 'success', data: offers });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
    // return this.offers;
  }

  getAllOffers(callback) {
    this.http.get('http://zamilrenttruck.com/api.php/get/alloffers', this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["data"]) {
        let offers = response["data"];
        callback({ result: 'success', data: offers });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
    // return this.offers;
  }

  getAllDrivers(callback) {
    this.http.get('http://zamilrenttruck.com/api.php/get/alldrivers', this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["data"]) {
        let offers = response["data"];
        callback({ result: 'success', data: offers });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
    // return this.offers;
  }

  createOffer(offer, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/offer/create', offer, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }

  getOffersByOwnerId(userid, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/offers/ownerid', { ownerid: userid }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["data"]) {
        let offers = response["data"];
        callback({ result: 'success', data: offers });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });

    // let offers = this.offers.filter((offer: AppOffer) => offer.userid == userid);    
    // return offers;
  }

  getApprovedOffers(callback) {

    this.http.get('http://zamilrenttruck.com/api.php/get/approvedoffers', this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["data"]) {
        let offers = response["data"];
        callback({ result: 'success', data: offers });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });

    // let offers = this.offers.filter((offer: AppOffer) => offer.status == 'approved');    
    // return offers;
  }

  createTripWithCustomerid(item, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/trip/create', item, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }

  createTruckType(item, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/trucktype/create', item, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }

  createPlace(item, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/place/create', item, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }



  createNewCompleteTripForPredefinedTripBooking(trip, quotation, userid, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/trip/createnew', { trip: [trip], quotation: [quotation], userid: userid }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        let offers = response["message"];
        callback({ result: 'success', message: offers });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }

  //Bookings History in Customer module
  getRequestedTripsForUserId(userid, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/get/requestedtripsforuserid', { userid: userid }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["data"]) {
        let offers = response["data"];
        callback({ result: 'success', data: offers });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });

    // let trips = this.trips.filter((trip: AppTrip) => (((trip.status == 'requested') || (trip.status == 'confirmed') || (trip.status == 'completed')) && (trip.userid == userid)));    
    // return trips;
  }

  createTripWithOwnerid(item, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/trip/createpredefined', item, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });

  }

  addQuotationForTrip(item, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/quotation/create', item, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }

  updateQuotationForTripAndConfirm(item, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/updateQuotationForTripAndConfirm', item, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }

  getQuotationsForTripIdOwnerId(tripid, ownerid, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/get/quotationsfortripidownerid', { tripid: tripid, ownerid: ownerid }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["data"]) {
        let offers = response["data"];
        callback({ result: 'success', data: offers });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });

    // let quotations = this.quotations.filter((quotation: AppQuotation) => ((quotation.ownerid == ownerid) && (quotation.tripid == tripid)));    
    // if(quotations.length > 0) {
    //   callback(quotations[0]);
    // } else {
    //   callback(null);
    // }
  }

  getQuotationsForTripId(tripid, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/get/quotationsfortripid', { tripid: tripid }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["data"]) {
        let offers = response["data"];
        callback({ result: 'success', data: offers });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });

    // let quotations = this.quotations.filter((quotation: AppQuotation) => quotation.tripid == tripid);    
    // return quotations;
  }

  getQuotationForId(quotationid, callback) {
    // quotationid
    // /get/quotationforquoteid

    this.http.post('http://zamilrenttruck.com/api.php/get/quotationforquoteid', { quotationid: quotationid }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["data"]) {
        let offers = response["data"];
        callback({ result: 'success', data: offers });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });


    // let quotations = this.quotations.filter((quotation: AppQuotation) => quotation.quotationid == quotationid);    
    // return quotations[0];
  }

  getConfirmedQuotationForTripId(tripid, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/get/confirmedquotationsfortripid', { tripid: tripid }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["data"]) {
        let offers = response["data"];
        callback({ result: 'success', data: offers });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });

    // let quotations = this.quotations.filter((quotation: AppQuotation) => ((quotation.tripid) == tripid && (quotation.status == "confirmed")));    
    // return quotations.length > 0 ? quotations[0] : null;
  }

  getCompletedQuotationForTripId(tripid, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/get/completedquotationsfortripid', { tripid: tripid }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["data"]) {
        let offers = response["data"];
        callback({ result: 'success', data: offers });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });

    // let quotations = this.quotations.filter((quotation: AppQuotation) => ((quotation.tripid) == tripid && (quotation.status == "confirmed")));    
    // return quotations.length > 0 ? quotations[0] : null;
  }

  confirmQuotation(quotationid, cost, duration, tripid, ownername, ownerid, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/confirmQuotation', { tripid: tripid, quotationid: quotationid, cost: cost, duration: duration, ownername: ownername, ownerid: ownerid }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });

  }

  deleteTrip(trip, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/app/delete', { id: trip.tripid, type: "trip" }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }

  deleteTruckType(trucktype, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/app/delete', { id: trucktype.trucktypeid, type: "trucktype" }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }

  deletePlace(place, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/app/delete', { id: place.id, type: "place" }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }

  completeTripWithId(tripid, quotationid, qcomments, qcharges, callback) {

    this.http.post('http://zamilrenttruck.com/api.php/completeTripWithId', { tripid: tripid, quotationid: quotationid, comments: qcomments, additionalcharges: qcharges },
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["message"]) {
          callback({ result: 'success', message: response["message"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });

    // let quotations = this.quotations.filter((quotation: AppQuotation) => quotation.quotationid == quotationid);    
    // let quotation = quotations[0];
    // let trips = this.trips.filter((trip: AppTrip) => trip.tripid == quotation.tripid);    
    // let trip = trips[0];
    // trip.status = "completed";
    // quotation.status = "completed";
  }

  addTruck(item, callback) {
    item.regno = item.regnum;
    item.photoid = "";
    this.http.post('http://zamilrenttruck.com/api.php/truck/create',
      item,
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["message"]) {
          callback({ result: 'success', message: response["message"], truckid: response["truckid"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
  }

  uploadTruckImage(item, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/truck/imageupload',
      item,
      this.header).toPromise().then(response => {
        console.log("data: " + response);
        if (response["error"]) {
          callback({ result: 'failure', error: response["error"] });
        } else if (response["message"]) {
          callback({ result: 'success', message: response["message"] });
        }
      }).catch(error => {
        console.log(error);
        callback({ result: 'failure', error: "Server Error. Please try after sometime." });
      });
  }

  //custoer admin
  deleteuser(item, callback) {
    // const index: number = this.users.indexOf(item);
    // if (index !== -1) {
    //     this.trucks.splice(index, 1);
    //     callback({result: 'success'});
    // } else {
    //   callback({result: 'failure', error: 'user not found'});
    // }
    this.http.post('http://zamilrenttruck.com/api.php/app/delete', { id: item.userid, type: "user" }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }
  approveuser(item, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/app/updatestatus', { id: item.userid, status: "approved", type: "user", email: item.email }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
    // let trucks = this.users.filter((user: AppUser) => user.userid == item.userid);    
    // if(trucks.length > 0){
    //   let truck = trucks[0];
    //   truck.status = "approved";
    //   callback({result: "success"});
    // } else {
    //   callback({result: "failure", error: "user not found"});
    // }
  }
  blockuser(item, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/app/updatestatus', { id: item.userid, status: "blocked", type: "user" }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
    // let users = this.users.filter((user: AppUser) => user.userid == item.userid);    
    // if(users.length > 0){
    //   let user = users[0];
    //   user.status = "blocked";
    //   callback({result: "success"});
    // } else {
    //   callback({result: "failure", error: "user not found"});
    // }
  }

  //Offer CRUD
  //custoer admin
  deleteoffer(item, callback) {
    // const index: number = this.offers.indexOf(item);
    // if (index !== -1) {
    //     this.offers.splice(index, 1);
    //     callback({result: 'success'});
    // } else {
    //   callback({result: 'failure', error: 'offer not found'});
    // }
    this.http.post('http://zamilrenttruck.com/api.php/app/delete', { id: item.offerid, type: "offer" }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }
  approveoffer(item, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/app/updatestatus', { id: item.offerid, status: "approved", type: "offer" }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }
  rejectoffer(item, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/app/updatestatus', { id: item.offerid, status: "rejected", type: "offer" }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }


  // Trucks admin
  deleteTruck(item, callback) {
    // const index: number = this.trucks.indexOf(item);
    // if (index !== -1) {
    //     this.trucks.splice(index, 1);
    //     callback({result: 'success'});
    // } else {
    //   callback({result: 'failure', error: 'truck not found'});
    // }
    this.http.post('http://zamilrenttruck.com/api.php/app/delete', { id: item.truckid, type: "truck" }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }
  approveTruck(item, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/app/updatestatus', { id: item.truckid, status: "approved", type: "truck" }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
    // let trucks = this.trucks.filter((truck: AppTruck) => truck.truckid == item.truckid);    
    // if(trucks.length > 0){
    //   let truck = trucks[0];
    //   truck.status = "approved";
    //   callback({result: "success"});
    // } else {
    //   callback({result: "failure", error: "truck not found"});
    // }
  }
  blockTruck(item, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/app/updatestatus', { id: item.truckid, status: "blocked", type: "truck" }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
    // let trucks = this.trucks.filter((truck: AppTruck) => truck.truckid == item.truckid);    
    // if(trucks.length > 0){
    //   let truck = trucks[0];
    //   truck.status = "blocked";
    //   callback({result: "success"});
    // } else {
    //   callback({result: "failure", error: "truck not found"});
    // }
  }

  sendForgotPassword(emailid, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/user/forgotpassword', { email: emailid }, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }

  submitRatingToCompletedTrip(trip, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/trip/submitrating', trip, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }

  updateVAT(vat, callback) {
    this.http.post('http://zamilrenttruck.com/api.php/constants/updatevat', vat, this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["message"]) {
        callback({ result: 'success', message: response["message"] });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }

  getAppConstants(callback) {

    this.http.get('http://zamilrenttruck.com/api.php/get/constants', this.header).toPromise().then(response => {
      console.log("data: " + response);
      if (response["error"]) {
        callback({ result: 'failure', error: response["error"] });
      } else if (response["data"]) {
        let offers = response["data"];
        callback({ result: 'success', data: offers });
      }
    }).catch(error => {
      console.log(error);
      callback({ result: 'failure', error: "Server Error. Please try after sometime." });
    });
  }

  //mark - Utility methods

  groupByreturningObject(array, key) {
    return array.reduce(function (arr, obj) {
      (arr[obj[key]] = arr[obj[key]] || []).push(obj);
      return arr;
    }, {});
  };

  groupByreturningArray(array, key, order) {
    array.sort((a, b) =>
      order ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key])
    );
    let currentgroup = "";
    let groupedArray = [];
    array.forEach((object, index) => {
      if (object[key] != currentgroup) {
        currentgroup = object[key];
        let newGroup = {
          group: currentgroup,
          list: []
        };
        groupedArray.push(newGroup);
      }
      groupedArray[groupedArray.length - 1].list.push(object);
    });
    return groupedArray;
  }
}

export class AppUser {

  constructor(public name: string = "",
    public email: string = "",
    public password: string = "",
    public phonenumber: string = "",
    public role: string = "",
    public userid: string = "",
    public status: string = "",
    public owneridfordriver: string = "",
    public licensefordriver: string = "",
    public nationalidfordriver: string = "",
    public profilepic: string = "",
    public token: string = localStorage.getItem("fcmtoken"),
    public platform: string = localStorage.getItem("platform")) {
  }

}

export class AppTruck {

  constructor(public type: string = "",
    public capacity: string = "",
    public regno: string = "",
    public photos: [string],
    public rating: string = "",
    public ownerid: string = "",
    public status: string = "",
    public truckid: string = "",
    public color: string = "",
    public modeldate: string = "",
    public trucktypeid: string = "") {
  }

}

export class AppTruckType {

  constructor(public trucktypeid: string = "",
    public type: string = "",
    public truckdescription: string = "") {
  }

}

export class AppTrip {

  constructor(public truckid: string = "",
    public trucktype: string = "",
    public startlocation: string = "",
    public endlocation: string = "",
    public status: string = "",
    public startdate: string = "",
    public comments: string = "",
    public tripid: string = "",
    public freight: string = "",
    public userid: string = "",
    public createddate: string = "",
    public rating: string = "",
    public ispredefined: string = "",
    public qidpdefinedtrip: string = "",
    public customerremarks: string = "",
    public cost: string = "",
    public duration: string = "",
    public ownerid: string = "",
    public ownername: string = "",
    public offerid: string = "",
    public offerdiscount: string = "",
    public offerdescription: string = "",
    public ostartdate: string = "",
    public oenddate: string = "", ) {
  }

}

export class AppQuotation {

  constructor(public truck: string = "",
    public driver: string = "",
    public duration: string = "",
    public cost: string = "",
    public status: string = "",
    public starttime: string = "",
    public closetime: string = "",
    public additionalcharges: string = "",
    public comments: string = "",
    public appliedofferid: string = "",
    public discount: string = "",
    public quotationid: string = "",
    public tripid: string = "",
    public ownerid: string = "",
    public ownername: string = "",
    public truckid: string = "") {
  }
}

export class AppOffer {

  constructor(public tripid: string = "",
    public message: string = "",
    public offerid: string = "",
    public truckid: string = "",
    public trucktype: string = "",
    public fromlocation: string = "",
    public tolocation: string = "",
    public price: string = "",
    public discount: string = "",
    public startdate: string = "",
    public enddate: string = "",
    public status: string = "",
    public userid: string = "") {
  }
}

export class AppCity {
  constructor(public id: string = "",
    public name: string = "") {
  }
}

export enum status {
  pending = "pending",
  approved = "approved",
  rejected = "rejected",
  requested = "requested",
  blocked = "blocked",
  cancelled = "cancelled",
  confirmed = "confirmed",
  completed = "completed"
}