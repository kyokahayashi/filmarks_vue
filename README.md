# filmarks_vue

###メモ
よく使われるブランチ名の命名規則
① トピックベースの命名
<タイプ>/<内容>-<簡単な説明>

タイプ 用途
feature 新機能の追加
fix バグ修正
hotfix 本番環境の緊急修正
refactor リファクタリング（動作は変えない）
chore 雑務的な変更（依存更新・設定変更など）
docs ドキュメントの変更
test テストの追加・修正
release リリース用のブランチ

② 命名例
タスク ブランチ名の例
本のレビュー機能を追加 feature/review-books
ボタンが動かないバグを修正 fix/button-click-error
ESLint 設定を変更 chore/update-eslint-config
README.md を更新 docs/update-readme
API 処理を改善（仕様変更なし） refactor/api-response-handler
本番環境で崩れたレイアウト修正 hotfix/fix-layout-prod
