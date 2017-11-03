import { css } from 'styled-components'

const StyleProps = {
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '600',
  },

  inputSizes: {
    regular: { width: 176, height: 32 },
    large: { width: 224, height: 32 },
  },

  borderRadius: '4px',

  animations: {
    swift: '.45s cubic-bezier(0.3, 1, 0.4, 1) 0s',
    rotation: css`
      animation: rotate 2s infinite linear;
      @keyframes rotate {
        from {transform: rotate(0deg);}
        to {transform: rotate(360deg);}
      }
    `,
  },

  media: {
    handheld: (...args) => css`
      @media (max-height: 760px) { 
        ${css(...args)}
      }
    `,
  },

  exactWidth: width => css`
    min-width: ${width};
    max-width: ${width};
  `,

  exactHeight: height => css`
    min-height: ${height};
    max-height: ${height};
  `,
}

export default StyleProps
