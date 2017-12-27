import {Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { JourService } from './../../services/jour.service';


import { LoadingController } from 'ionic-angular';
import { AnimationService, AnimationBuilder } from 'css-animator';

import { AlertController } from 'ionic-angular';
import {Jour} from "../../entity/Jour";


@Component({
  selector: 'page-jour',
  templateUrl: 'jour.html'
})
export class JourPage {

      @ViewChild('myElementitem') myitem;

      private animator: AnimationBuilder;
      jours;
      dorefresh:any;
  searchQuery: string = '';


      constructor (public atrCtrl: AlertController,public navCtrl: NavController, public jourService: JourService,public loadingCtrl: LoadingController, animationService: AnimationService) {
        this.animator = animationService.builder();
       }

      ionViewDidEnter() {
        let loader = this.loadingCtrl.create({
          content: "Please wait...",
          duration: 1000
        });
        loader.present();
        this.getalljour();
      }

  doRefresh(refresher) {
        this.dorefresh=refresher;
        setTimeout(() => {
          this.jourService.getJours().then(data=>{
            this.jours = data;
          });
          refresher.complete();
        }, 1000);
  }

  doRefreshlist() {
    setTimeout(() => {
      this.jourService.getJours().then(data=>{
        this.jours = data;
      });
      this.dorefresh.complete();
    }, 1000);
  }


      getalljour()
      {
            this.jours=[];
            this.jourService.getJours().then(data=>{
              this.jours= data;
            });
      }

      animateElem() {
        this.animator.setType('bounceInLeft').show(this.myitem.nativeElement);
      }


      DeleteJour(idjour)
      {
          for(let i = 0; i < this.jours.length; i++)
          if(this.jours[i].id == idjour){  this.jours.splice(i, 1);  }

          this.jourService.removeJour(idjour).then(data=>{
            this.jours=[];
            this.getalljour();
          });
      }

      EditJour(jour) {
        let alert = this.atrCtrl.create({
          title: 'Add Departement',
          inputs: [
            {
              name: 'id',
              placeholder: 'id',
              type: 'hidden',
              value:jour.id
            },
            {
              name: 'nom',
              placeholder: 'jour',
              type: 'text',
              value:jour.nom
            }
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Editer',
              handler: data => {
                if (  data.id!=null  && data.nom!=null  ) {


                  let jour=new Jour();
                  console.log("data"+data);

                  jour.id=data.id;
                  jour.nom= data.nom;
                  console.log(jour);


                  this.jourService.editjours(jour).then(data=>{

                    console.log(this.jours);
                  });

                  this.doRefresh(this.dorefresh);

                } else {
                  return false;
                }
              }
            }
          ]
        });
        alert.present();
      }


    AddJour() {
        let alert = this.atrCtrl.create({
          title: 'Add Jour',
          inputs: [
            {
              name: 'nom',
              placeholder: 'jour',
              type: 'text'
            }
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Add',
              handler: data => {
                if (  data.nom!=null  ) {


                  let jour=new Jour();
                  jour.nom=data.nom;

                  this.jourService.setJours(jour).then(data=>{

                  });

                  this.doRefresh(this.dorefresh);

                } else {
                  return false;
                }
              }
            }
          ]
        });
        alert.present();

      }



  searchjour(ev: any) {
    this.getalljour();

    let val = ev.target.value;

    if (val && val.trim() != '') {


      this.jourService.getJours().then(data=>{
        this.jours = data;
        this.jours =this.jours.filter((data) => {
          return (data.nom.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      });




    }
  }

}
