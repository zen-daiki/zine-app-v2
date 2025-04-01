import { StyleSheet } from 'react-native';

// アプリケーション全体で使用される共通のカラー
export const colors = {
  primary: '#FFD700', // 金色
  background: '#25292e', // 暗い背景色
  cardBackground: '#3a3f44', // カード背景色
  cardBackgroundSelected: '#4a4f54', // 選択されたカード背景色
  text: '#ffffff', // 白テキスト
  textDark: '#000000', // 黒テキスト
  error: '#ff0000', // エラーカラー
  border: '#ffffff20', // 半透明の境界線
};

// 共通のスタイル
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  form: {
    gap: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 6,
    marginTop: 16,
  },
  buttonLabel: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: 'bold',
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
  },
  outlinedButtonLabel: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

// 共通のテキスト入力プロパティ
export const inputProps = {
  mode: 'outlined' as const,
  outlineColor: colors.primary,
  activeOutlineColor: colors.primary,
  textColor: colors.textDark,
  theme: {
    colors: {
      background: '#FFFFFF',
    },
  },
};
