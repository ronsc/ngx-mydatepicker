import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { NgxMyDatePicker } from "./ngx-my-date-picker.component";
import { NgxMyDatePickerDirective } from "./ngx-my-date-picker.input";
import { FocusDirective } from "./directives/ngx-my-date-picker.focus.directive";

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [NgxMyDatePicker, NgxMyDatePickerDirective, FocusDirective],
    entryComponents: [NgxMyDatePicker],
    exports: [NgxMyDatePicker, NgxMyDatePickerDirective, FocusDirective]
})
export class NgxMyDPTHModule {
}
