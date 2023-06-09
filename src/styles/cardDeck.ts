import { css } from "lit";

export const cardDeckStylesStaff = css`
    .card-deck {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
    }

    @media (min-width: 992px) {
        .card-deck {
            grid-gap: 3rem;
        }

        .card-deck {
            grid-template-columns: repeat(auto-fill, minmax(33.33%, 1fr));
        }
    }

    @media (min-width: 1200px) {
        .card-deck {
            grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
        }
    }

    @media (min-width: 1600px) {
        .card-deck {
            grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
        }
    }

    @media (min-width: 1920px) {
        .card-deck {
            grid-template-columns: repeat(auto-fill, minmax(16.67%, 1fr));
        }
    }
`;

export const cardDeckStylesOpac = css`
    .card-deck {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
    }

    @media (min-width: 768px) {
        .card-deck {
            grid-gap: 1rem;
        }

        .card-deck {
            grid-template-columns: repeat(auto-fill, minmax(33.33%, 1fr));
        }
    }

    @media (min-width: 992px) {
        .card-deck {
            grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
        }
    }

    @media (min-width: 1200px) {
        .card-deck {
            grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
        }
    }

    @media (min-width: 1600px) {
        .card-deck {
            grid-template-columns: repeat(auto-fill, minmax(16.67%, 1fr));
        }
    }
`;
