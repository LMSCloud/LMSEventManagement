import { customElement, property } from "lit/decorators.js";
import LMSTable from "../components/LMSTable";
import { html } from "lit";
import {
  EventType,
  TargetGroup,
  URIComponents,
  LMSLocation,
} from "../sharedDeclarations";
import LMSAnchor from "../components/LMSAnchor";
import { __ } from "../lib/translate";

declare global {
  interface HTMLElementTagNameMap {
    "lms-anchor": LMSAnchor;
  }
}

@customElement("lms-event-types-table")
export default class LMSEventTypesTable extends LMSTable {
  @property({ type: Array }) target_groups: TargetGroup[] = [];
  @property({ type: Array }) locations: LMSLocation[] = [];
  @property({ type: Array }) event_types: EventType[] = [];
  @property({ type: Object, attribute: false }) href: URIComponents = {
    path: "/cgi-bin/koha/plugins/run.pl",
    query: true,
    params: {
      class: "Koha::Plugin::Com::LMSCloud::EventManagement",
      method: "configure",
    },
  };

  override handleEdit(e: Event) {
    if (e.target) {
      let inputs: NodeListOf<HTMLInputElement | HTMLSelectElement> =
        this.renderRoot.querySelectorAll("input, select");
      inputs.forEach((input) => {
        input.disabled = true;
      });

      const target = e.target as HTMLElement;
      let parent = target.parentElement;
      while (parent && parent.tagName !== "TR") {
        parent = parent.parentElement;
      }

      if (parent) {
        inputs = parent?.querySelectorAll("input, select");
        inputs?.forEach((input) => {
          input.disabled = false;
        });
      }
    }
  }

  handleInput(input: HTMLInputElement | HTMLSelectElement, value: unknown) {
    if (input instanceof HTMLInputElement && input.type === "checkbox") {
      return input.checked ? "1" : "0";
    }

    return value;
  }

  override async handleSave(e: Event) {
    const target = e.target as HTMLElement;

    let parent = target.parentElement;
    while (parent && parent.tagName !== "TR") {
      parent = parent.parentElement;
    }

    let id,
      inputs = undefined;
    if (parent) {
      id = parent.firstElementChild?.textContent?.trim();
      inputs = parent.querySelectorAll("input, select") as NodeListOf<
        HTMLInputElement | HTMLSelectElement
      >;
    }

    if (!id || !inputs) {
      return;
    }

    const response = await fetch(
      `/api/v1/contrib/eventmanagement/event_types/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          ...Array.from(inputs).reduce((acc, input) => {
            if (input.dataset.group && input instanceof HTMLInputElement) {
              const group = input.dataset.group;
              if (!(group in acc)) {
                acc[group] = [];
              }

              const { id, name, value } = input;

              const groupArray = acc[group] as Array<Record<string, unknown>>;
              const groupIndex = groupArray.findIndex((item) => item.id === id);

              if (groupIndex === -1) {
                groupArray.push({
                  id,
                  [name]: this.handleInput(input, value),
                });
                return acc;
              }

              groupArray[groupIndex][name] = this.handleInput(input, value);
              return acc;
            }

            acc[input.name] = this.handleInput(input, input.value);
            return acc;
          }, {} as Record<string, unknown>),
        }),
      }
    );

    if (response.status >= 200 && response.status <= 299) {
      inputs.forEach((input) => {
        input.disabled = true;
      });
      return;
    }

    if (response.status >= 400) {
      const error = await response.json();
      this.renderToast(response.statusText, error);
    }
  }

  override async handleDelete(e: Event) {
    const target = e.target as HTMLElement;

    let parent = target.parentElement;
    while (parent && parent.tagName !== "TR") {
      parent = parent.parentElement;
    }

    let id = undefined;
    if (parent) {
      id = parent.firstElementChild?.textContent?.trim();
    }

    if (!id) {
      return;
    }

    const response = await fetch(
      `/api/v1/contrib/eventmanagement/event_types/${id}`,
      { method: "DELETE" }
    );

    if (response.status >= 200 && response.status <= 299) {
      return;
    }

    if (response.status >= 400) {
      const error = await response.json();
      this.renderToast(response.statusText, error);
    }
  }

  constructor() {
    super();
    this.order = [
      "id",
      "name",
      "target_groups",
      "min_age",
      "max_age",
      "max_participants",
      "location",
      "image",
      "description",
      "open_registration",
    ];
    this.isEditable = true;
    this.isDeletable = true;
    this.emptyTableMessage = html`${__("You have to create a")}&nbsp;
      <lms-anchor
        .href=${{
          ...this.href,
          params: {
            ...this.href.params,
            op: "target-groups",
          },
        }}
        >${__("target group")}</lms-anchor
      >&nbsp;${__("and a")}&nbsp;
      <lms-anchor
        .href=${{
          ...this.href,
          params: {
            ...this.href.params,
            op: "locations",
          },
        }}
        >${__("location")}</lms-anchor
      >
      &nbsp;${__("first")}.`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.hydrate();
  }

  private hydrate() {
    this.data = this.event_types.map((event_type: EventType) => {
      return Object.fromEntries(
        this.getColumnData(event_type, [
          ["target_groups", this.target_groups],
          ["location", this.locations],
        ])
      );
    });
  }
}
