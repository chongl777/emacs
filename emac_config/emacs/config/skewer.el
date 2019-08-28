(add-lib-path "skewer-mode")
(add-lib-path "emacs-web-server")
(require 'skewer-mode)
(require 'skewer-repl)
(require 'simple-httpd)
(require 'skewer-bower)
(require 'skewer-html)
(require 'skewer-css)

(defun my-skewer-mode-hook ()
  "Hooks for Web mode."
  (defun run-skewer-server()
    (interactive)
    (httpd-start)
    (browse-url (format "http://%s:%d"
                (cl-case httpd-host
                  ((nil) "0.0.0.0") ((local) "localhost") (otherwise httpd-host)) httpd-port)))
  (defun my-run-skewer(directory)
    (interactive "DServe directory: \n")
    (httpd-serve-directory directory)
    (run-skewer))
  )

(add-hook 'skewer-mode-hook 'my-skewer-mode-hook)

(add-hook 'js2-mode-hook 'skewer-mode)
(add-hook 'css-mode-hook 'skewer-css-mode)
(add-hook 'html-mode-hook 'skewer-html-mode)
