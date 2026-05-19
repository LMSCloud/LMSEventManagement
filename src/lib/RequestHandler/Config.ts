import { ApiEndpoints } from "./types/RequestHandler";

export const BASE_PATH = "/api/v1/contrib/eventmanagement";

export const ENDPOINTS: ApiEndpoints = {
    get: {
        eventsPublic: {
            url: `${BASE_PATH}/public/events`,
            cache: false,
        },
        eventPublic: {
            url: `${BASE_PATH}/public/events`,
            cache: false,
        },
        eventsCountPublic: {
            url: `${BASE_PATH}/public/events/count`,
            cache: false,
        },
        targetGroupsPublic: {
            url: `${BASE_PATH}/public/target_groups`,
            cache: true,
        },
        eventTypesPublic: {
            url: `${BASE_PATH}/public/event_types`,
            cache: true,
        },
        imagePublic: {
            url: `${BASE_PATH}/public/image`,
            cache: true,
        },
        locationsPublic: {
            url: `${BASE_PATH}/public/locations`,
            cache: true,
        },
        settingsPublic: {
            url: `${BASE_PATH}/public/settings`,
            cache: true,
        },
        eventIcalPublic: {
            url: `${BASE_PATH}/public/events`,
            cache: false,
        },
        bookingHouseholdPublic: {
            url: `${BASE_PATH}/public/bookings/household`,
            cache: false,
        },
        bookingsMinePublic: {
            url: `${BASE_PATH}/public/bookings/mine`,
            cache: false,
        },
        settings: {
            url: `${BASE_PATH}/settings`,
            cache: false,
        },
        events: {
            url: `${BASE_PATH}/events`,
            cache: false,
        },
        eventTypes: {
            url: `${BASE_PATH}/event_types`,
            cache: true,
        },
        images: {
            url: `${BASE_PATH}/images`,
            cache: true,
        },
        locations: {
            url: `${BASE_PATH}/locations`,
            cache: true,
        },
        targetGroups: {
            url: `${BASE_PATH}/target_groups`,
            cache: true,
        },
        branches: {
            url: `/api/v1/libraries`,
            cache: true,
        },
        eventAttendees: {
            url: `${BASE_PATH}/events`,
            cache: false,
        },
    },
    post: {
        settings: {
            url: `${BASE_PATH}/settings`,
            cache: false,
        },
        events: {
            url: `${BASE_PATH}/events`,
            cache: false,
        },
        eventTypes: {
            url: `${BASE_PATH}/event_types`,
            cache: false,
        },
        images: {
            url: `${BASE_PATH}/images`,
            cache: false,
        },
        locations: {
            url: `${BASE_PATH}/locations`,
            cache: false,
        },
        targetGroups: {
            url: `${BASE_PATH}/target_groups`,
            cache: false,
        },
        bookingsPublic: {
            url: `${BASE_PATH}/public/bookings`,
            cache: false,
        },
        bookingConfirmPublic: {
            url: `${BASE_PATH}/public/bookings/confirm`,
            cache: false,
        },
        bookingCancelPublic: {
            url: `${BASE_PATH}/public/bookings`,
            cache: false,
        },
    },
    put: {
        settings: {
            url: `${BASE_PATH}/settings`,
            cache: false,
        },
        events: {
            url: `${BASE_PATH}/events`,
            cache: false,
        },
        eventTypes: {
            url: `${BASE_PATH}/event_types`,
            cache: false,
        },
        locations: {
            url: `${BASE_PATH}/locations`,
            cache: false,
        },
        targetGroups: {
            url: `${BASE_PATH}/target_groups`,
            cache: false,
        },
    },
    patch: {
        attendee: {
            url: `${BASE_PATH}/attendees`,
            cache: false,
        },
    },
    delete: {
        events: {
            url: `${BASE_PATH}/events`,
            cache: false,
        },
        eventTypes: {
            url: `${BASE_PATH}/event_types`,
            cache: false,
        },
        image: {
            url: `${BASE_PATH}/image`,
            cache: false,
        },
        locations: {
            url: `${BASE_PATH}/locations`,
            cache: false,
        },
        targetGroups: {
            url: `${BASE_PATH}/target_groups`,
            cache: false,
        },
    },
};
