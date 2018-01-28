import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AppModelServiceProvider {

  currentUser: AppUser;
  users : AppUser[];
  trucks: AppTruck[];
  trucktypes: AppTruckType[];  
  trips: AppTrip[];
  offers: AppOffer[];
  quotations: AppQuotation[];
  predefinedlistofplaces: String[];
  header : any;

  // status: pending, approved, rejected
  constructor(public http: HttpClient) {
    console.log('Hello AppModelServiceProvider Provider');
    this.header = { "headers": {"Content-Type": "application/json"} };
    this.getCurrentUser();
    this.predefinedlistofplaces = [
      "Riyadh",
      "Jeddah",
      "Mecca",
      "Medina",
      "Al-Ahsa",
      "Ta'if",
      "Dammam",
      "Buraidah",
      "Khobar",
      "Tabuk",
      "Qatif",
      "Khamis Mushait",
      "Ha'il",
      "Hafar Al-Batin",
      "Jubail",
      "Al-Kharj",
      "Abha",
      "Najran",
      "Yanbu",
      "Al Qunfudhah"
    ];
    this.users = [new AppUser("admin1", "admin1@gmail.com", "admin", "1234567890", "admin", "1", "pending", ""),
                   new AppUser("admin2", "admin2@gmail.com", "admin", "1234567890", "admin", "2", "pending", ""),
                   new AppUser("driver1", "driver1@gmail.com", "driver", "1234567890", "driver", "3", "pending", "5"),
                   new AppUser("driver2", "driver2@gmail.com", "driver", "1234567890", "driver", "4", "pending", "6"),
                   new AppUser("owner1", "owner1@gmail.com", "owner", "1234567890", "owner", "5", "pending", ""),
                   new AppUser("owner2", "owner2@gmail.com", "owner", "1234567890", "owner", "6", "pending", ""),
                   new AppUser("customer1", "customer1@gmail.com", "customer", "1234567890", "customer", "7", "pending", ""),
                   new AppUser("customer2", "customer2@gmail.com", "customer", "1234567890", "customer", "8", "pending", "")];
  
    this.trucktypes = [new AppTruckType("1","Flatbed",""),
                        new AppTruckType("2","Lowbed",""),
                        new AppTruckType("3","Curtainside",""),
                        new AppTruckType("4","Reefer",""),
                        new AppTruckType("5","Car Transporter",""),
                        new AppTruckType("6","Tipper",""),
                        new AppTruckType("7","Tanker",""),
                        new AppTruckType("8","Container","")];

  // this.trucks = new Array<AppTruck>();

    // this.trips = new Array<AppTrip>();
    // this.quotations = new Array<AppQuotation>(); 
    
    this.trucks = [new AppTruck("Flatbed","2000 cc","SA15A6600",null,"0","5","pending","1","red","12/12/2016","1"),
                    new AppTruck("Lowbed","2200 cc","SA15A5500",null,"0","5","pending","2","gren","12/12/2016","2")];

    this.quotations = [new AppQuotation("","","12","1500", "pending", "", "", "", "", "", "", "1", "1", "5", "owner1", ""),
                        new AppQuotation("","","15","2000", "pending", "", "", "", "", "", "", "2", "2", "5", "owner1", "")];         

    this.trips = [new AppTrip("","Flatbed","Jedda","Mecca","pending","","","1","","5","","0","true","1","","1200","15",""),
                  new AppTrip("","Lowbed","Medina","Mecca","pending","","","2","","5","","0","true","2","","1800","25","")];

    this.offers = [new AppOffer("1","Promotional Offer","1","1","Flatbed","Jedda","Mecca","","15","12/12/2017","29/12/2017","pending","5"),
                    new AppOffer("2","Promotional Offer","2","2","Lowbed","Jedda","Mecca","","20","12/12/2017","29/12/2017","pending","5")];
  }

  setCurrentUser(item){
    this.currentUser = new AppUser(item.name, item.email, item.password, item.phonenumber, item.role, item.userid, item.status, item.ownerid)
    localStorage.setItem("user",JSON.stringify(this.currentUser));
    // this.storage.set('user', this.currentUser);
  }

  getCurrentUser() {
    if(this.currentUser) {
      return this.currentUser;
    } else {
      let user = localStorage.getItem("user");
      if(user){
        this.currentUser = JSON.parse(user);
        return this.currentUser;
      } else {
        return null;
      }
      // this.storage.get('user').then((val) => {
      //   this.currentUser = val;
      //   return this.currentUser;
      // });
    }
  }

  addUser(item) {
    return this.users[this.users.push(
      new AppUser(item.name, item.email, item.password, item.phonenumber, item.role, String(this.users.length+1), item.status, item.ownerid)
    )-1];
  }

  removeUser(item) {
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i] == item) {
        this.users.splice(i, 1);
      }
    }
  }

  loginService(item, callback) {
    // this.http.post('http://zamilrenttruck.com/login',
    //   { username: item.email,
    //     password: item.password,
    //     token : localStorage.getItem("fcmtoken"),
    //     platform: localStorage.getItem("platform")
    //   }, this.header).toPromise().then(response => {
    //     console.log("data: "+response);
    //     if(response["error"]){
    //       callback({result: 'failure', error: response["error"]});
    //     } else if(response["message"]){
    //       let msg = response["message"];
    //       callback({result: 'success', data: msg});
    //     } else {
    //       callback({result: 'failure', error: "Unkown error."});
    //     }
    //   }).catch(error => {
    //     console.log(error);
    //     callback({result: 'failure', error: "Server Error. Please try after sometime."});
    //   });
    
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
    
  }

  registrationService(item, callback){

    this.http.post('http://zamilrenttruck.com/user/create',
      { role: item.role,
        name: item.name,
        phonenumber: item.phonenumber,
        email: item.email,
        password: item.password,
        status: item.status,
        token : localStorage.getItem("fcmtoken"),
        platform: localStorage.getItem("platform")
      }, this.header).toPromise().then(response => {
        console.log("data: "+response);
        if(response["message"]){
          callback({result: 'failure', error: response["message"]});
        } else if(response["data"]){
          let user = response["data"];
          callback({result: 'success', data: user.length>0 ? user[0] : []});
        }
      }).catch(error => {
        console.log(error);
        callback({result: 'failure', error: "Server Error. Please try after sometime."});
      });

    // let users = this.users.filter((user: AppUser) => user.email == item.email);
    // if(users.length > 0){
    //   callback({result: 'failure', error: "Emailid already exists. Please register with new emailid."});             
    // } else {
    //   callback({result: 'success', data: this.addUser(item)});
    // }
  }

  getUsersByRole(role){
    let users = this.users.filter((user: AppUser) => user.role == role);
    return <any>users;
  }

  getUserById(userid) {
    let users = this.users.filter((user: AppUser) => user.userid == userid);
    if(users.length > 0){
      return users[0];
    } else {
      return null;
    }
  }

  getDriversForOwner(ownerid) {
    let users = this.users.filter((user: AppUser) => user.owneridfordriver == ownerid);
    return <any>users;
  }

  getTruckTypes() {
    return this.trucktypes;
  }

  getTrucks() {
    return this.trucks;
  }

  getTrucksForOwnerid(ownerid) {
    let trucks = this.trucks.filter((truck: AppTruck) => truck.ownerid == ownerid);    
    return trucks;
  }

  getTruckForTripId(truckid) {
    let trucks = this.trucks.filter((truck: AppTruck) => truck.truckid == truckid);    
    return trucks.length > 0 ? trucks[0] : null;
  }
  
  getTrips() {
    return this.trips;
  }

  getTripsForCustomerid(userid) {
    let trips = this.trips.filter((trip: AppTrip) => ((trip.userid == userid) && (trip.status != 'completed')));    
    return trips;
  }

  getCustomPendingTrips() {
    let trips = this.trips.filter((trip: AppTrip) => (((trip.status == "pending") || (trip.status == "requested")) && (trip.ispredefined == "false")));    
    return trips;
  }

  // getBookingsForOwnerid(userid) {
  //   let trips = this.trips.filter((trip: AppTrip) => trip.ownerid == userid);    
  //   return trips;
  // }

  getAvailableTrips(){
    let trips = this.trips.filter((trip: AppTrip) => trip.ispredefined == 'true');    
    return trips;
  }

  getOwnerAvailableTrips(userid){
    let trips = this.trips.filter((trip: AppTrip) => (trip.ispredefined == 'true' && trip.userid == userid));    
    return trips;
  }

  getRequestedTripsForOwnerid(userid) {
    let trips = this.trips.filter((trip: AppTrip) => (trip.ispredefined == 'false' && trip.ownerid == userid));    
    return trips;
  }

  getConfirmedTripsforDriverId(userid) {
    //first get confirmed quotations for driverid
      let quotations = this.quotations.filter((quotation: AppQuotation) => ((quotation.driver) == userid && (quotation.status == "confirmed")));    
      // return quotations;
      var trips : any[] = [];
      for(var i=0; i<quotations.length; i++){
        let ftrips = this.trips.filter((trip: AppTrip) => (trip.ispredefined == 'false' && trip.tripid == quotations[i].tripid));    
        trips.push(ftrips[0]);
      }
    return trips;
  }

  getOffers() {
    return this.offers;
  }

  getOffersByOwnerId(userid) {
    let offers = this.offers.filter((offer: AppOffer) => offer.userid == userid);    
    return offers;
  }
  getApprovedOffers() {
    let offers = this.offers.filter((offer: AppOffer) => offer.status == 'approved');    
    return offers;
  }

  createTripWithCustomerid(item, callback) {
     this.trips[this.trips.push(
      new AppTrip(item.truckid, 
                  item.trucktype,
                  item.startlocation, 
                  item.endlocation, 
                  item.status, 
                  item.startdate, 
                  item.comments, 
                  String(this.trips.length+1), 
                  item.freight, 
                  item.userid, 
                  item.createddate, 
                  item.rating, 
                  item.ispredefined,
                  item.qidpdefinedtrip,
                  item.remarks,
                  item.cost,
                  item.duration,
                  item.ownerid)
    )-1];
    callback();
  }

  createNewCompleteTripForPredefinedTripBooking(trip, quotation, userid) {
    let ntrip: AppTrip = Object.assign({}, trip);
    let nquotation: AppQuotation = Object.assign({}, quotation);

    ntrip.ownerid = trip.userid;
    ntrip.userid = userid;
    ntrip.tripid = this.trips.length.toString();
    ntrip.ispredefined = "false";
    nquotation.quotationid = this.quotations.length.toString();
    ntrip.status = "requested";
    nquotation.status = "requested";
    ntrip.tripid = (this.trips.length+1).toString();
    nquotation.quotationid = (this.quotations.length+1).toString();
    nquotation.tripid = ntrip.tripid ;
    this.trips.push(ntrip);
    this.quotations.push(nquotation);
  }

  //Bookings History in Customer module
  getRequestedTripsForUserId(userid) {
    let trips = this.trips.filter((trip: AppTrip) => (((trip.status == 'requested') || (trip.status == 'confirmed') || (trip.status == 'completed')) && (trip.userid == userid)));    
    return trips;
  }

  createTripWithOwnerid(item) {
    return this.trips[this.trips.push(
      new AppTrip(item.truckid, 
                  item.trucktype,
                  item.startlocation, 
                  item.endlocation, 
                  item.status, 
                  item.startdate, 
                  item.comments, 
                  String(this.trips.length), 
                  item.freight, 
                  item.userid, 
                  item.createddate, 
                  item.rating, 
                  item.ispredefined,
                  item.qidpdefinedtrip,
                  item.remarks,
                  item.cost,
                  item.duration,
                  item.ownerid)
    )-1];
  }

  addQuotationForTrip(item, callback) {
     this.quotations[this.quotations.push(
      new AppQuotation(item.truck , 
        item.driver , 
        item.duration,
        item.cost,
        item.status,
        item.starttime,
        item.closetime,
        item.additionalcharges,
        item.comments,
        item.appliedofferid,
        item.discount,
        String(this.quotations.length+1),
        item.tripid,
        item.ownerid,
        item.ownername,
        item.truckid)
    )-1];
    callback();
  }

  updateQuotationForTripAndConfirm(item, callback) {
    let quotations = this.quotations.filter((quotation: AppQuotation) => quotation.quotationid == item.quotationid);
    if (quotations.length > 0) {
      let quotation = quotations[0];
      quotation.driver = item.driver;
      quotation.starttime = item.starttime;
      quotation.closetime = item.closetime;
      quotation.duration = item.duration;
      quotation.truckid = item.truckid;
      quotation.additionalcharges = item.additionalcharges;
      quotation.comments = item.comments;
      quotation.cost = item.cost;

      let trips = this.trips.filter((trip: AppTrip) => ((trip.tripid == quotation.tripid) && (trip.ispredefined == 'false')));
      let trip = trips[0];
      trip.status = "confirmed";
      quotation.status = "confirmed";
      trip.cost = quotation.cost;
      trip.duration = quotation.duration;
    }
    callback();
  }

  getAllQuotations() {
    return this.quotations;
  }

  getQuotationsForOwnerId(ownerid) {
    let quotations = this.quotations.filter((quotation: AppQuotation) => quotation.ownerid == ownerid);    
    return quotations;
  }

  getQuotationsForTripIdOwnerId(tripid, ownerid, callback) {
    let quotations = this.quotations.filter((quotation: AppQuotation) => ((quotation.ownerid == ownerid) && (quotation.tripid == tripid)));    
    if(quotations.length > 0) {
      callback(quotations[0]);
    } else {
      callback(null);
    }
  }

  getQuotationsForTripId(tripid) {
    let quotations = this.quotations.filter((quotation: AppQuotation) => quotation.tripid == tripid);    
    return quotations;
  }

  getQuotationForId(quotationid) {
    let quotations = this.quotations.filter((quotation: AppQuotation) => quotation.quotationid == quotationid);    
    return quotations[0];
  }

  // createQuotationForPredefinedTripId(tripid) {
  //   let quotation = new AppQuotation();
  //   return quotations;
  // }

  getConfirmedQuotationForTripId(tripid){
    let quotations = this.quotations.filter((quotation: AppQuotation) => ((quotation.tripid) == tripid && (quotation.status == "confirmed")));    
    return quotations.length > 0 ? quotations[0] : null;
  }

  confirmQuotation(quotationid, callback) {
    let quotations = this.quotations.filter((quotation: AppQuotation) => quotation.quotationid == quotationid);    
    let quotation = quotations[0];
    let trips = this.trips.filter((trip: AppTrip) => trip.tripid == quotation.tripid);    
    let trip = trips[0];
    trip.status = "confirmed";
    quotation.status = "confirmed";
    trip.cost=quotation.cost;
    trip.duration=quotation.duration;
    callback();
  }

  deleteTrip(trip, callback) {
    const index: number = this.trips.indexOf(trip);
  if (index !== -1) {
      this.trips.splice(index, 1);
      callback({result: 'success'});
  } else {
    callback({result: 'failure', error: 'user not found'});
  }
  }

  completeTripWithId(tripid, quotationid) {
    let quotations = this.quotations.filter((quotation: AppQuotation) => quotation.quotationid == quotationid);    
    let quotation = quotations[0];
    let trips = this.trips.filter((trip: AppTrip) => trip.tripid == quotation.tripid);    
    let trip = trips[0];
    trip.status = "completed";
    quotation.status = "completed";
  }

  addTruck(item) {
    return this.trucks[this.trucks.push(
      new AppTruck(item.trucktype, 
                    item.capacity, 
                    item.regnum, 
                    item.photos, 
                    item.rating, 
                    item.ownerid, 
                    item.status, 
                    String(this.trucks.length+1),
                    item.color, 
                    item.modeldate, 
                    item.trucktypeid,)
    )-1];
  }

//custoer admin
deleteuser(item, callback) {
  const index: number = this.users.indexOf(item);
  if (index !== -1) {
      this.trucks.splice(index, 1);
      callback({result: 'success'});
  } else {
    callback({result: 'failure', error: 'user not found'});
  }
}
approveuser(item, callback) {
  let trucks = this.users.filter((user: AppUser) => user.userid == item.userid);    
  if(trucks.length > 0){
    let truck = trucks[0];
    truck.status = "approved";
    callback({result: "success"});
  } else {
    callback({result: "failure", error: "user not found"});
  }
}
blockuser(item, callback) {
  let users = this.users.filter((user: AppUser) => user.userid == item.userid);    
  if(users.length > 0){
    let user = users[0];
    user.status = "blocked";
    callback({result: "success"});
  } else {
    callback({result: "failure", error: "user not found"});
  }
}

//Offer CRUD
//custoer admin
deleteoffer(item, callback) {
  const index: number = this.offers.indexOf(item);
  if (index !== -1) {
      this.offers.splice(index, 1);
      callback({result: 'success'});
  } else {
    callback({result: 'failure', error: 'offer not found'});
  }
}
approveoffer(item, callback) {
  let offers = this.offers.filter((offer: AppOffer) => offer.userid == item.userid);    
  if(offers.length > 0){
    let offer = offers[0];
    offer.status = "approved";
    callback({result: "success"});
  } else {
    callback({result: "failure", error: "offer not found"});
  }
}
rejectoffer(item, callback) {
  let offers = this.offers.filter((offer: AppOffer) => offer.userid == item.userid);    
  if(offers.length > 0){
    let offer = offers[0];
    offer.status = "rejected";
    callback({result: "success"});
  } else {
    callback({result: "failure", error: "offer not found"});
  }
}


  // Trucks admin
  deleteTruck(item, callback) {
    const index: number = this.trucks.indexOf(item);
    if (index !== -1) {
        this.trucks.splice(index, 1);
        callback({result: 'success'});
    } else {
      callback({result: 'failure', error: 'truck not found'});
    }
  }
  approveTruck(item, callback) {
    let trucks = this.trucks.filter((truck: AppTruck) => truck.truckid == item.truckid);    
    if(trucks.length > 0){
      let truck = trucks[0];
      truck.status = "approved";
      callback({result: "success"});
    } else {
      callback({result: "failure", error: "truck not found"});
    }
  }
  blockTruck(item, callback) {
    let trucks = this.trucks.filter((truck: AppTruck) => truck.truckid == item.truckid);    
    if(trucks.length > 0){
      let truck = trucks[0];
      truck.status = "blocked";
      callback({result: "success"});
    } else {
      callback({result: "failure", error: "truck not found"});
    }
  }

  sendForgotPassword(emailid){

  }

  //mark - Utility methods

  groupByreturningObject(array, key) {
    return array.reduce(function(arr, obj) {
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
    array.forEach((object, index) =>  {
                 if(object[key] != currentgroup){
                     currentgroup = object[key];
                     let newGroup = {
                         group: currentgroup,
                         list: []
                     };
                     groupedArray.push(newGroup);
                 } 
                 groupedArray[groupedArray.length-1].list.push(object);
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
                    public ownerid: string = "") {
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
                  public userid: string = ""){
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