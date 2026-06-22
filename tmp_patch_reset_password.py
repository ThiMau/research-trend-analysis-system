from pathlib import Path
path = Path(r'd:\backup\dcm\swp391\New folder\text\research-trend-analysis-system\src\Page\ResetPassword\ResetPassword.jsx')
text = path.read_text(encoding='utf-8')
marker = '\n                    <div className="rules">\n'
idx = text.find(marker)
if idx == -1:
    raise SystemExit('marker not found')
insert = '\n                    <label>\n                        CONFIRM PASSWORD\n                    </label>\n\n                    <div className="password-wrapper">\n                        <input\n                            type={showConfirmPassword ? "text" : "password"}\n                            value={confirmPassword}\n                            onChange={(e) => setConfirmPassword(e.target.value)}\n                            placeholder="Confirm new password"\n                        />\n                        <span\n                            className="eye"\n                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}\n                        >\n                            👁\n                        </span>\n                    </div>\n'
text = text[:idx] + insert + text[idx:]
path.write_text(text, encoding='utf-8')
print('inserted confirm password block')
