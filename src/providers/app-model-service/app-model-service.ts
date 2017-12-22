import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AppModelServiceProvider {

  currentUser: AppUser;
  users : AppUser[];
  trucks: AppTruck[];
  trips: AppTrip[];
  offers: AppOffer[];
  quotations: AppQuotation[];
  
  // status: pending, approved, rejected
  constructor(public http: HttpClient) {
    console.log('Hello AppModelServiceProvider Provider');
    this.users = [new AppUser("admin1", "admin1@gmail.com", "admin", "1234567890", "admin", "1", "pending", ""),
                   new AppUser("admin2", "admin2@gmail.com", "admin", "1234567890", "admin", "2", "pending", ""),
                   new AppUser("driver1", "driver1@gmail.com", "driver", "1234567890", "driver", "3", "pending", "5"),
                   new AppUser("driver2", "driver2@gmail.com", "driver", "1234567890", "driver", "4", "pending", "6"),
                   new AppUser("owner1", "owner1@gmail.com", "owner", "1234567890", "owner", "5", "pending", ""),
                   new AppUser("owner2", "owner2@gmail.com", "owner", "1234567890", "owner", "6", "pending", ""),
                   new AppUser("customer1", "customer1@gmail.com", "customer", "1234567890", "customer", "7", "pending", ""),
                   new AppUser("customer2", "customer2@gmail.com", "customer", "1234567890", "customer", "8", "pending", "")];
  
  this.trucks = [new AppTruck("Flatbed","2000cc","12345",[""],"4", "1", "approved", "1"),
                  new AppTruck("Lowbed","3000cc","67890",[""],"5", "1", "approved", "2"),
                  new AppTruck("Curtainside","4000cc","10293",[""],"3", "2", "approved", "3"),
                  new AppTruck("Reefer","2000cc","11111",[""],"4", "2", "approved", "4"),
                  new AppTruck("Car Transporter","3000cc","22222",[""],"5", "3", "approved", "5"),
                  new AppTruck("Tipper","4000cc","33333",[""],"3", "3", "approved", "6"),
                  new AppTruck("Tanker","2000cc","44444",[""],"4", "4", "approved", "7"),
                  new AppTruck("Container","3000cc","55555",[""],"5", "4", "approved", "8"),
                  new AppTruck("Pickup","4000cc","66666",[""],"3", "5", "approved", "9"),
                  new AppTruck("Bus","2000cc","77777",[""],"4", "5", "approved", "10")];

    this.trips = new Array<AppTrip>();
    this.quotations = new Array<AppQuotation>();         
  
    this.offers = [new AppOffer(null,null,"Special offer","1"),
                    new AppOffer(null,null,"Super offer","2"),
                    new AppOffer(null,null,"Travel offer","3")];
  }

  setCurrentUser(item){
    this.currentUser = new AppUser(item.name, item.email, item.password, item.phonenumber, item.role, item.userid, item.status, item.ownerid)
  }

  addUser(item) {
    return this.users[this.users.push(
      new AppUser(item.name, item.email, item.password, item.phonenumber, item.role, String(this.users.length), item.status, item.ownerid)
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
    let users = this.users.filter((user: AppUser) => user.email == item.email);
    if(users.length > 0){
      callback({result: 'failure', error: "Emailid already exists. Please register with new emailid."});             
    } else {
      callback({result: 'success', data: this.addUser(item)});
    }
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
    let trips = this.trips.filter((trip: AppTrip) => trip.userid == userid);    
    return trips;
  }


  getOffers() {
    return this.offers;
  }

  createTripWithCustomerid(item) {
    return this.trips[this.trips.push(
      new AppTrip(item.trucktype, item.startlocation, item.endlocation, item.status, item.startdate, item.comments, item.offers, String(this.trips.length), item.freight, item.userid, item.createddate, item.rating, item.ispredefined)
    )-1];
  }

  addQuotationForTrip(item) {
    return this.quotations[this.quotations.push(
      new AppQuotation(item.truck , 
        item.driver , 
        item.duration,
        item.cost,
        item.status,
        item.starttime,
        item.closetime,
        item.additionalcharges,
        item.comments,
        item.offers,
        String(this.quotations.length),
        item.tripid,
        item.ownerid,
        item.ownername,
        item.truckid)
    )-1];
  }

  getAllQuotations() {
    return this.quotations;
  }

  getQuotationsForOwnerId(ownerid) {
    let quotations = this.quotations.filter((quotation: AppQuotation) => quotation.ownerid == ownerid);    
    return quotations;
  }

  getQuotationsForTripId(tripid) {
    let quotations = this.quotations.filter((quotation: AppQuotation) => quotation.tripid == tripid);    
    return quotations;
  }

  getConfirmedQuotationForTripId(tripid){
    let quotations = this.quotations.filter((quotation: AppQuotation) => ((quotation.tripid) == tripid && (quotation.status == "confirmed")));    
    return quotations.length > 0 ? quotations[0] : null;
  }

  confirmQuotation(quotationid) {
    let quotations = this.quotations.filter((quotation: AppQuotation) => quotation.quotationid == quotationid);    
    let quotation = quotations[0];
    let trips = this.trips.filter((trip: AppTrip) => trip.tripid == quotation.tripid);    
    let trip = trips[0];
    trip.status = "confirmed";
    quotation.status = "confirmed";
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
      new AppTruck(item.trucktype, item.capacity, item.regnum, item.photos, item.rating, item.ownerid, item.status, String(this.trucks.length))
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
  
    constructor(public name: string, 
                public email: string, 
                public password: string,
                public phonenumber: string,
                public role: string,
                public userid: string,
                public status: string,
                public owneridfordriver: string) {
    }
  
  }

  export class AppTruck {
    
      constructor(public type: string, 
                  public capacity: string, 
                  public regno: string,
                  public photos: [string],
                  public rating: string,
                  public ownerid: string,
                  public status: string,
                  public truckid: string) {
      }
    
    }

    export class AppTrip {
      
        constructor(public trucktype: string, 
                    public startlocation: string, 
                    public endlocation: string,
                    public status: string,
                    public startdate: string,
                    public comments: [string],
                    public offers: [string],
                    public tripid: string,
                    public freight: string,
                    public userid: string,
                    public createddate: string,
                    public rating: string,
                    public ispredefined: string) {
        }
      
      }

    export class AppQuotation {
      
      constructor(public truck: string, 
        public driver: string,
        public duration: string,
        public cost: string,
        public status: string,
        public starttime: string,
        public closetime: string,
        public additionalcharges: string,
        public comments: string,
        public offers: [string],
        public quotationid: string,
        public tripid: string,
        public ownerid: string,
        public ownername: string,
        public truckid: string) {
}
    }
    
    export class AppOffer {

      constructor(public days: [string],
                  public trips: [string],
                  public details: string,
                  public offerid: string){
        
      }
    }