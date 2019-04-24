import { AuthGuard } from ".";
import { Injectable } from "@angular/core";

@Injectable()
export class PublicGuard extends AuthGuard {

}
