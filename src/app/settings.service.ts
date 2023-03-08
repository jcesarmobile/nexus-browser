import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Service } from './discovery';
import { App } from '@capacitor/app';

export enum Role {
  destructive = 'destructive',
  cancel = 'cancel',
  go = 'go',
  privacy = 'privacy',
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor() {}

  public async presentSettings(ctrl: ActionSheetController): Promise<Role> {
    const info = await App.getInfo();
    const actionSheet = await ctrl.create({
      header: 'Settings',
      subHeader: `v${info.version}.${info.build}`,
      buttons: [
        { text: 'Privacy Policy', role: Role.privacy },
        {
          text: 'Clear History',
          role: Role.destructive,
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Exit',
          role: Role.cancel,
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    if (!result.role) return Role.cancel;
    return result.role as Role;
  }

  public async presentActions(ctrl: ActionSheetController, service: Service): Promise<Role> {
    const delBtn = {
      text: 'Delete',
      role: Role.destructive,
      data: {
        action: 'delete',
      },
    };
    const cancelBtn = {
      text: 'Cancel',
      role: Role.cancel,
      data: {
        action: 'cancel',
      },
    };
    let buttons = [delBtn, cancelBtn];

    if (service.port) {
      buttons = [
        {
          text: service.address + ':' + service.port,
          role: Role.go,
          data: {
            action: 'go',
          },
        },
        cancelBtn,
      ];
    }
    const actionSheet = await ctrl.create({
      header: service.name,
      subHeader: service.hostname,
      buttons,
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    if (!result.role) return Role.cancel;
    return result.role as Role;
  }
}
