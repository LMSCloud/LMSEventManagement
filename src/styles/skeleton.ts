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
    border-radius: 5px;
  }

  .skeleton-text:last-child {
    margin-bottom: 0;
    width: 80%;
  }

  .skeleton-table {
    display: table;
    width: 100%;
    height: 50vh;
    height: 50dvh;
    border-collapse: collapse;
    border-spacing: 0;
    border: 1px solid #dee2e6;
    border-radius: 5px;
  }

  .skeleton-card {
    flex: 0 0 auto;
    margin: 1rem;
    width: calc(20% - 2rem);
    height: 20rem;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
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
