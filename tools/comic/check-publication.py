from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin,urlsplit,unquote
import re,json,hashlib
root=Path(__file__).resolve().parents[2];site=root/'comic';receipt=json.loads((site/'publication-receipt.json').read_text());base=receipt['mount'];issues=[];links=0
assert hashlib.sha256((site/'STYLE-PIN.md').read_bytes()).hexdigest()==receipt['style_pin_sha256']
for k,prefix in [('outputs',site),('source_hashes',root),('style_evidence',site)]:
 for p,h in receipt[k].items():assert hashlib.sha256((prefix/p).read_bytes()).hexdigest()==h,p
class Links(HTMLParser):
 def __init__(self):super().__init__();self.urls=[]
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k in ['href','src','action'] and v:self.urls.append(v)
for f in sorted(site.rglob('*')):
 if f.suffix not in ['.html','.svg','.css']:continue
 text=f.read_text();urls=[]
 if f.suffix=='.html':p=Links();p.feed(text);urls+=p.urls
 urls += [m[1] for m in re.findall(r'url\(\s*([\'"]?)([^\'"\)]+)\1\s*\)',text)]
 relative=str(f.relative_to(site));page='https://preview.invalid'+base+'/'+relative
 for u in urls:
  if u.startswith(('#','data:','mailto:','tel:')):continue
  parts=urlsplit(urljoin(page,u))
  if parts.netloc!='preview.invalid':continue
  links+=1
  if not parts.path.startswith(base+'/'):issues.append((relative,u,'escapes mount'));continue
  local=site/unquote(parts.path[len(base)+1:])
  if local.is_dir():local=local/'index.html'
  if not local.is_file():issues.append((relative,u,'missing target'))
assert not issues,issues
print(f'Verified hashes and {links} mounted local references; no missing targets or escaped-root links.')
