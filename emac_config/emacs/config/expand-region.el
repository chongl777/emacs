(add-lib-path "expand-region")
(require 'expand-region)

(global-set-key (kbd "C-c l") 'er/mark-word)
(global-set-key (kbd "C-=") 'er/expand-region)
; (global-set-key (kbd "M-s s") 'er/expand-region)
