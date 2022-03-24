local private = {};
local public = {};
aeslua = public;
if table.unpack == nil then
    table.unpack = unpack
end
local ciphermode = require("aeslua.ciphermode");
local util = require("aeslua.util");

--
-- Simple API for encrypting strings.
--
public.AES128 = 16;
public.AES192 = 24;
public.AES256 = 32;

public.ECBMODE = 1;
public.CBCMODE = 2;
public.OFBMODE = 3;
public.CFBMODE = 4;

function private.pwToKey(password, keyLength)
    local padLength = keyLength;
    if (keyLength == public.AES192) then
        padLength = 32;
    end

    if (padLength > #password) then
        local postfix = "";
        for i = 1,padLength - #password do
            postfix = postfix .. string.char(0);
        end
        password = password .. postfix;
    else
        password = string.sub(password, 1, padLength);
    end

    local pwBytes = {string.byte(password,1,#password)};
    password = ciphermode.encryptString(pwBytes, password, ciphermode.encryptCBC);

    password = string.sub(password, 1, keyLength);

    return {string.byte(password,1,#password)};
end
function string.fromhex(str)
    return (str:gsub(
        "..",
        function(cc)
            return string.char(tonumber(cc, 16))
        end
    ))
end
function public.decrypt(password, data, keyLength, mode)
    local mode = mode or public.CBCMODE;
    local keyLength = keyLength or public.AES128;

    local key = private.pwToKey(password, keyLength);
    data=string.fromhex(data);
    local plain;
    if (mode == public.ECBMODE) then
        plain = ciphermode.decryptString(key, data, ciphermode.decryptECB);
    elseif (mode == public.CBCMODE) then
        plain = ciphermode.decryptString(key, data, ciphermode.decryptCBC);
    elseif (mode == public.OFBMODE) then
        plain = ciphermode.decryptString(key, data, ciphermode.decryptOFB);
    elseif (mode == public.CFBMODE) then
        plain = ciphermode.decryptString(key, data, ciphermode.decryptCFB);
    end

    result = util.unpadByteString(plain);

    if (result == nil) then
        return nil;
    end

    return result;
end


function public.getServerKey(v)
    if IsServer() then
        if _G.__ServerKeyV2__ == nil then
            _G.__ServerKeyV2__= GetDedicatedServerKeyV2(v)
            CustomNetTables:SetTableValue("common", "encrypt_key", {_=_G.__ServerKeyV2__})
        end
        return _G.__ServerKeyV2__
    else
        return (CustomNetTables:GetTableValue("common", "encrypt_key") or {})._ or ""
    end
end
_G.decryptModule = function(encrypted, ...)
    return (assert(load(encrypted, debug.getinfo(2).source, 't', getfenv(2)))(...))
end