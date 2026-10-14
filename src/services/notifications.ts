import type { NotificationService } from './ports';
// Only UI notices. No mail, SMTP or network delivery.
export class MockNotificationService implements NotificationService {
 constructor(private readonly showLocalNotice:(message:string)=>void){}
 notify(message:string){this.showLocalNotice(message);}
}
