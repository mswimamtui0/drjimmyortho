import os
import re
import glob

# Define emoji regex pattern
emoji_pattern = re.compile(
    "["
    "\U0001F300-\U0001F9FF"  # Emoticons
    "\U00002600-\U000027BF"  # Misc symbols
    "\U0001F600-\U0001F64F"  # Emoticons
    "\U0001F680-\U0001F6FF"  # Transport
    "\U0001F700-\U0001F77F"  # Alchemical
    "\U0001F780-\U0001F7FF"  # Geometric
    "\U0001F800-\U0001F8FF"  # Supplemental
    "\U0001F900-\U0001F9FF"  # Supplemental
    "\U0001FA00-\U0001FA6F"  # Chess
    "\U0001FA70-\U0001FAFF"  # Symbols
    "\U00002600-\U000026FF"  # Misc
    "\U00002700-\U000027BF"  # Dingbats
    "\U0000FE00-\U0000FE0F"  # Variation
    "\U0001F000-\U0001F02F"  # Mahjong
    "\U0001F100-\U0001F1FF"  # Enclosed
    "\U0001F200-\U0001F2FF"  # Enclosed
    "\U0001F300-\U0001F5FF"  # Misc
    "\U0001F600-\U0001F64F"  # Emoticons
    "\U0001F680-\U0001F6FF"  # Transport
    "\U0001F700-\U0001F77F"  # Alchemical
    "\U0001F780-\U0001F7FF"  # Geometric
    "\U0001F800-\U0001F8FF"  # Supplemental
    "\U0001F900-\U0001F9FF"  # Supplemental
    "\U0001FA00-\U0001FA6F"  # Chess
    "\U0001FA70-\U0001FAFF"  # Symbols
    "]",
    re.UNICODE
)

def remove_emojis(text):
    return emoji_pattern.sub('', text)

# Process all JS files
js_files = glob.glob('**/*.js', recursive=True)

for file_path in js_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove emojis
        new_content = remove_emojis(content)
        
        # Also remove common emoji shortcuts
        new_content = re.sub(r'📤|📥|📊|📋|📝|📅|📧|📱|📞|✅|❌|⏳|🔍|🔒|🖼️|🩻|🦴|🎥|👨‍⚕️|🏥|💳|💊|⭐|👋|📄|📍|👤|🌍|🚀|💡|📌|🔄|📁|📂', '', new_content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'✅ Removed emojis from: {file_path}')
    except Exception as e:
        print(f'❌ Error processing {file_path}: {e}')

print('🎉 Done! All emojis removed.')