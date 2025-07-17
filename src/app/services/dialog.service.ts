import { Injectable, ComponentRef, ViewContainerRef, Type, ApplicationRef, inject, createComponent, EnvironmentInjector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private applicationRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  /**
   * Open a dialog component
   */
  openDialog<T>(componentType: Type<T>): ComponentRef<T> {
    // Create the component
    const componentRef = createComponent(componentType, {
      environmentInjector: this.injector
    });

    // Attach to the Angular application
    this.applicationRef.attachView(componentRef.hostView);

    // Add to DOM
    const domElement = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElement);

    // Return the component reference for further interaction if needed
    return componentRef;
  }

  /**
   * Close a dialog (called from within the dialog component)
   */
  closeDialog(componentRef: ComponentRef<any>): void {
    this.applicationRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
