DOCS_DIR = docs/
FREEZE_DIR = _freeze/
CACHE_DIR = .jupyter_cache/
QUARTO_DIR = .quarto/
MAKE = quarto render

all: clean build deploy

clean: 
	rm -rf $(DOCS_DIR) $(FREEZE_DIR) $(CACHE_DIR) $(QUARTO_DIR)

build: 
	$(MAKE) --output-dir $(DOCS_DIR)

deploy:
	git pull
	git add -A 
	git commit -m "update on `date +'%Y-%m-%d %H:%M:%S'`"
	git push 