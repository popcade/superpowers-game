import SceneSettingsResource from "../data/SceneSettingsResource";

export default class SceneSettingsEditor {

  projectClient: SupClient.ProjectClient;
  resource: SceneSettingsResource;

  defaultCameraModeRow: SupClient.table.RowParts;

  fields: { [name: string]: HTMLInputElement|HTMLSelectElement } = {};

  constructor(container: HTMLDivElement, projectClient: SupClient.ProjectClient) {
    this.projectClient = projectClient;

    let { tbody } = SupClient.table.createTable(container);

    this.defaultCameraModeRow = SupClient.table.appendRow(tbody, "Default camera mode");
    this.fields["defaultCameraMode"] = SupClient.table.appendSelectBox(this.defaultCameraModeRow.valueCell, { "3D": "3D", "2D": "2D" });

    this.fields["defaultCameraMode"].addEventListener("change", (event: any) => {
      this.projectClient.socket.emit("edit:resources", "sceneSettings", "setProperty", "defaultCameraMode", event.target.value, (err: string) => { if (err != null) alert(err); });
    });

    this.projectClient.subResource("sceneSettings", this);
  }

  onResourceReceived = (resourceId: string, resource: SceneSettingsResource) => {
    this.resource = resource;

    for (let setting in resource.pub) {
      this.fields[setting].value = resource.pub[setting];
    }
  }

  onResourceEdited = (resourceId: string, command: string, propertyName: string) => {
    this.fields[propertyName].value = this.resource.pub[propertyName];
  }
}
