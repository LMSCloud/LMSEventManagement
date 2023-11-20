import { css } from "lit";

export const skeletonStyles = css`
    .skeleton {
        opacity: 0.7;
        animation: skeleton-loading 1s linear infinite alternate;
    }

    .skeleton-text {
        color: transparent;
        width: 100%;
        height: 1em;
        margin-bottom: 0.25rem;
        border-radius: 0.5rem;
    }

    .skeleton-text:last-child {
        margin-bottom: 0;
        width: 80%;
    }

    .skeleton-floating-menu {
        width: 100%;
        height: 5.75rem;
        margin-bottom: 1rem;
        border-radius: 0.5rem;
    }

    .skeleton-table {
        display: table;
        width: 100%;
        height: 50vh;
        height: 50dvh;
        border-collapse: collapse;
        border-spacing: 0;
        border: 1px solid #dee2e6;
        border-radius: 0.5rem;
    }

    .skeleton-card {
        height: 20rem;
        border: 1px solid #dee2e6;
        border-radius: 0.5rem;
    }

    @keyframes skeleton-loading {
        0% {
            background-color: hsl(200, 20%, 70%);
        }

        100% {
            background-color: hsl(200, 20%, 95%);
        }
    }
`;
