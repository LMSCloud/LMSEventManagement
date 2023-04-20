import { css } from "lit";

export const skeletonStyles = css`
  .skeleton {
    width: 3rem;
    height: 1em;
    opacity: 0.7;
    background-color: hsl(200, 20%, 70%);
    animation: skeleton-loading 1s linear infinite alternate;
  }

  .skeleton-text {
    width: 100%;
    height: 0.5rem;
    margin-bottom: 0.25rem;
    border-radius: 0.125rem;
  }

  .skeleton-text:last-child {
    margin-bottom: 0;
    width: 80%;
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
