import { theme } from '../theme';

describe('theme', () => {
  describe('colors', () => {
    it('should have background color defined', () => {
      expect(theme.colors.background).toBeDefined();
      expect(typeof theme.colors.background).toBe('string');
    });

    it('should have surface colors defined', () => {
      expect(theme.colors.surface).toBeDefined();
      expect(theme.colors.surfaceElevated).toBeDefined();
    });

    it('should have text colors defined', () => {
      expect(theme.colors.text).toBeDefined();
      expect(theme.colors.textSecondary).toBeDefined();
      expect(theme.colors.textTertiary).toBeDefined();
      expect(theme.colors.textMicro).toBeDefined();
    });

    it('should have border colors defined', () => {
      expect(theme.colors.border).toBeDefined();
      expect(theme.colors.borderMedium).toBeDefined();
      expect(theme.colors.borderStrong).toBeDefined();
    });

    it('should have interactive colors defined', () => {
      expect(theme.colors.primary).toBeDefined();
      expect(theme.colors.primaryLight).toBeDefined();
      expect(theme.colors.disabled).toBeDefined();
    });

    it('should have accent colors defined', () => {
      expect(theme.colors.accent).toBeDefined();
      expect(theme.colors.accentLight).toBeDefined();
    });
  });

  describe('spacing', () => {
    it('should have all spacing values defined as numbers', () => {
      expect(typeof theme.spacing.micro).toBe('number');
      expect(typeof theme.spacing.xs).toBe('number');
      expect(typeof theme.spacing.sm).toBe('number');
      expect(typeof theme.spacing.md).toBe('number');
      expect(typeof theme.spacing.lg).toBe('number');
      expect(typeof theme.spacing.xl).toBe('number');
      expect(typeof theme.spacing.xxl).toBe('number');
      expect(typeof theme.spacing.xxxl).toBe('number');
    });

    it('should have spacing values in ascending order', () => {
      expect(theme.spacing.micro).toBeLessThan(theme.spacing.xs);
      expect(theme.spacing.xs).toBeLessThan(theme.spacing.sm);
      expect(theme.spacing.sm).toBeLessThan(theme.spacing.md);
      expect(theme.spacing.md).toBeLessThan(theme.spacing.lg);
      expect(theme.spacing.lg).toBeLessThan(theme.spacing.xl);
      expect(theme.spacing.xl).toBeLessThan(theme.spacing.xxl);
      expect(theme.spacing.xxl).toBeLessThan(theme.spacing.xxxl);
    });
  });

  describe('borderRadius', () => {
    it('should have all border radius values defined as numbers', () => {
      expect(typeof theme.borderRadius.none).toBe('number');
      expect(typeof theme.borderRadius.sm).toBe('number');
      expect(typeof theme.borderRadius.md).toBe('number');
      expect(typeof theme.borderRadius.lg).toBe('number');
    });

    it('should have border radius values in ascending order', () => {
      expect(theme.borderRadius.none).toBeLessThanOrEqual(theme.borderRadius.sm);
      expect(theme.borderRadius.sm).toBeLessThan(theme.borderRadius.md);
      expect(theme.borderRadius.md).toBeLessThan(theme.borderRadius.lg);
    });
  });

  describe('typography', () => {
    const typographyKeys = [
      'display',
      'title',
      'heading',
      'subheading',
      'body',
      'bodyMedium',
      'bodySemibold',
      'caption',
      'captionMedium',
      'micro',
      'microRegular',
      'numeric',
      'numericLarge',
    ];

    typographyKeys.forEach((key) => {
      it(`should have ${key} typography style with required properties`, () => {
        expect(theme.typography[key]).toBeDefined();
        expect(typeof theme.typography[key].fontSize).toBe('number');
        expect(typeof theme.typography[key].fontWeight).toBe('string');
        expect(typeof theme.typography[key].letterSpacing).toBe('number');
        expect(typeof theme.typography[key].lineHeight).toBe('number');
      });
    });

    it('should have font sizes in descending order for main hierarchy', () => {
      expect(theme.typography.display.fontSize).toBeGreaterThan(theme.typography.title.fontSize);
      expect(theme.typography.title.fontSize).toBeGreaterThan(theme.typography.heading.fontSize);
      expect(theme.typography.heading.fontSize).toBeGreaterThan(theme.typography.body.fontSize);
      expect(theme.typography.body.fontSize).toBeGreaterThan(theme.typography.caption.fontSize);
      expect(theme.typography.caption.fontSize).toBeGreaterThan(theme.typography.micro.fontSize);
    });
  });

  describe('elevation', () => {
    const elevationKeys = ['none', 'low', 'medium', 'high'];

    elevationKeys.forEach((key) => {
      it(`should have ${key} elevation with required shadow properties`, () => {
        expect(theme.elevation[key]).toBeDefined();
        expect(theme.elevation[key].shadowColor).toBeDefined();
        expect(theme.elevation[key].shadowOffset).toBeDefined();
        expect(typeof theme.elevation[key].shadowOffset.width).toBe('number');
        expect(typeof theme.elevation[key].shadowOffset.height).toBe('number');
        expect(typeof theme.elevation[key].shadowOpacity).toBe('number');
        expect(typeof theme.elevation[key].shadowRadius).toBe('number');
        expect(typeof theme.elevation[key].elevation).toBe('number');
      });
    });

    it('should have elevation values in ascending order', () => {
      expect(theme.elevation.none.elevation).toBeLessThanOrEqual(theme.elevation.low.elevation);
      expect(theme.elevation.low.elevation).toBeLessThan(theme.elevation.medium.elevation);
      expect(theme.elevation.medium.elevation).toBeLessThan(theme.elevation.high.elevation);
    });

    it('should have shadow opacity in ascending order', () => {
      expect(theme.elevation.none.shadowOpacity).toBeLessThanOrEqual(theme.elevation.low.shadowOpacity);
      expect(theme.elevation.low.shadowOpacity).toBeLessThanOrEqual(theme.elevation.medium.shadowOpacity);
      expect(theme.elevation.medium.shadowOpacity).toBeLessThanOrEqual(theme.elevation.high.shadowOpacity);
    });
  });
});
