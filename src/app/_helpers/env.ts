export enum SitebillModes {
    standalone,
    application
};
export function detect_mode () {
    if ( document.getElementById('app_root') ) {
        if ( document.getElementById('app_root').getAttribute('standalone_mode') === 'true' ) {
            return SitebillModes.standalone;
        }
    }
    return SitebillModes.application;
}
