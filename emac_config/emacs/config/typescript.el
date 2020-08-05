(add-lib-path "typescript.el")
(add-lib-path "tide")

(require 'tide)
(require 'typescript-mode)
;; (autoload 'js2-mode "js2-mode" nil t)
(add-to-list 'auto-mode-alist '("\\.ts$" . typescript-mode))
;; (add-to-list 'auto-mode-alist '("\\.ts$" . tide-mode))

;; ;;(add-to-list 'auto-mode-alist '("\\.jsx$" . js2-mode))
;; (add-to-list 'auto-mode-alist '("\\.json$" . js2-mode))
(defun setup-tide-mode ()
  (interactive)
  (tide-setup)
  (flycheck-mode +1)
  (setq flycheck-check-syntax-automatically '(save mode-enabled))
  (eldoc-mode +1)
  (tide-hl-identifier-mode +1)
  ;; company is an optional dependency. You have to
  ;; install it separately via package-install
  ;; `M-x package-install [ret] company`
  (company-mode +1))

;; aligns annotation to the right hand side
(setq company-tooltip-align-annotations t)

;; formats the buffer before saving
(add-hook 'before-save-hook 'tide-format-before-save)

(add-hook 'typescript-mode-hook #'setup-tide-mode)
