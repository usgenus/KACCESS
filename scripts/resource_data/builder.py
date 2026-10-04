# -*- coding: utf-8 -*-
"""
Resource Data Builder:
Compiles all 80 redesigned articles and categories into data/resource_center_data.js
"""
import json
import re
import os

from scripts.resource_data.common import CATEGORIES
from scripts.resource_data.cat_housing import get_housing_articles
from scripts.resource_data.cat_financial import get_financial_articles
from scripts.resource_data.cat_medicaid import get_medicaid_articles
from scripts.resource_data.cat_medicaid_specials import get_medicaid_specials_articles
from scripts.resource_data.cat_prescription import get_prescription_articles
from scripts.resource_data.cat_in_home_care import get_in_home_care_articles
from scripts.resource_data.cat_long_term_care import get_long_term_care_articles
from scripts.resource_data.cat_legal_rights_part1 import get_legal_rights_part1_articles
from scripts.resource_data.cat_legal_rights_part2 import get_legal_rights_part2_articles

def build():
    all_articles = []
    all_articles.extend(get_housing_articles())
    all_articles.extend(get_financial_articles())
    all_articles.extend(get_medicaid_articles())
    all_articles.extend(get_medicaid_specials_articles())
    all_articles.extend(get_prescription_articles())
    all_articles.extend(get_in_home_care_articles())
    all_articles.extend(get_long_term_care_articles())
    all_articles.extend(get_legal_rights_part1_articles())
    all_articles.extend(get_legal_rights_part2_articles())

    # Sort strictly by numerical ID: art-1 -> art-80
    all_articles.sort(key=lambda a: int(a['id'].split('-')[1]))

    # Calculate word_count and ensure clean fields
    for art in all_articles:
        text_only = re.sub(r'<[^>]+>', ' ', art['content_html'])
        words = len(text_only.split())
        art['word_count'] = words

    dataset = {
        "categories": CATEGORIES,
        "articles": all_articles
    }

    output_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'resource_center_data.js')
    output_path = os.path.abspath(output_path)

    js_content = "window.COMMUNITY_RESOURCES_DATA = " + json.dumps(dataset, ensure_ascii=False, indent=2) + ";\nwindow.RESOURCE_CENTER_DATA = window.COMMUNITY_RESOURCES_DATA;\n"

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"Successfully compiled {len(all_articles)} articles across {len(CATEGORIES)} categories into {output_path}")

if __name__ == '__main__':
    build()
