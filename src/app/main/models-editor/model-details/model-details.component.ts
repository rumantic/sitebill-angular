import {Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import {SitebillEntity, SitebillModelItem} from "../../../_models";
import {ModelsEditorService} from "../models-editor.service";
import {takeUntil} from "rxjs/operators";
import {SitebillResponse} from "../../../_models/sitebill-response";
import {SnackService} from "../../../_services/snack.service";


@Component({
    selector     : 'model-details',
    templateUrl  : './model-details.component.html',
    styleUrls    : ['./model-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ModelDetailsComponent implements OnInit, OnDestroy
{
    @Input()
    model: SitebillEntity;

    public sitebillResponse:SitebillResponse;


    tags: any[];
    formType: string;
    todoForm: FormGroup;

    @ViewChild('titleInput')
    titleInputField;
    SelectionType = 'checkbox';

    columns = [];
    rows = [];


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param _snackService
     * @param _modelsEditorService
     */
    constructor(
        private _formBuilder: FormBuilder,
        protected _snackService: SnackService,
        protected _modelsEditorService: ModelsEditorService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.sitebillResponse = new SitebillResponse();

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.todoForm = this.createTodoForm();

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Focus title field
     */
    focusTitleField(): void
    {
        setTimeout(() => {
            this.titleInputField.nativeElement.focus();
        });
    }

    /**
     * Create todo form
     *
     * @returns {FormGroup}
     */
    createTodoForm(): FormGroup
    {
        return this._formBuilder.group({
            id       : [],
            title    : [],
            notes    : [],
            startDate: [],
            dueDate  : [],
            completed: [],
            starred  : [],
            important: [],
            deleted  : [],
            tags     : []
        });
    }

    /**
     * Toggle star
     *
     * @param event
     */
    toggleStar(event): void
    {
        event.stopPropagation();
        // this.todo.toggleStar();
        // this._todoService.updateTodo(this.todo);
    }

    /**
     * Toggle important
     *
     * @param event
     */
    toggleImportant(event): void
    {
        event.stopPropagation();
        // this.todo.toggleImportant();
        // this._todoService.updateTodo(this.todo);
    }

    /**
     * Toggle Completed
     *
     * @param event
     */
    toggleCompleted(event): void
    {
        event.stopPropagation();
        // this.todo.toggleCompleted();
        // this._todoService.updateTodo(this.todo);
    }

    /**
     * Toggle Deleted
     *
     * @param event
     */
    toggleDeleted(event): void
    {
        event.stopPropagation();
        // this.todo.toggleDeleted();
        // this._todoService.updateTodo(this.todo);
    }

    /**
     * Toggle tag on todo
     *
     * @param tagId
     */
    toggleTagOnTodo(tagId): void
    {
        // this._todoService.toggleTagOnTodo(tagId, this.todo);
    }

    /**
     * Has tag?
     *
     * @param tagId
     * @returns {any}
     */
    hasTag(tagId): any
    {
        // return this._todoService.hasTag(tagId, this.todo);
    }

    /**
     * Add todo
     */
    addTodo(): void
    {
        // this._todoService.updateTodo(this.todoForm.getRawValue());
    }

    toggle(model_item: SitebillModelItem, toggled_column: string) {
        this._modelsEditorService.toggle(model_item.columns_id, toggled_column)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                Object.assign(this.sitebillResponse, result);
                if ( this.sitebillResponse.success() ) {
                    model_item.required_boolean = !model_item.required_boolean;
                    this._snackService.message(this.sitebillResponse.message);
                } else {
                    this._snackService.error(this.sitebillResponse.message);
                }
            });
    }
}
