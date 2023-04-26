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

  @keyframes skeleton-loading {
    0% {
      background-color: hsl(200, 20%, 70%);
    }

    100% {
      background-color: hsl(200, 20%, 95%);
    }
  }
`;
