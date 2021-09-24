import {Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import {SitebillEntity} from "../../../_models";


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

    tags: any[];
    formType: string;
    todoForm: FormGroup;

    @ViewChild('titleInput')
    titleInputField;

    columns = [{ prop: 'name' }, { name: 'title' }, { name: 'type' }];
    rows = [
        {
            name: 'test',
            title: 'test',
            type: 'test',
        },
        {
            name: 'test',
            title: 'test',
            type: 'test',
        },
    ];


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
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
}
