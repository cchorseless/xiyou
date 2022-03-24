package.path = package.path .. ";scripts/?.lua"
if table.unpack == nil then
    table.unpack = unpack
end

require "aeslua.aeslua"

function string.fromhex(str)
    return (str:gsub(
        "..",
        function(cc)
            return string.char(tonumber(cc, 16))
        end
    ))
end

function string.tohex(str)
    return (str:gsub(
        ".",
        function(c)
            return string.format("%02X", string.byte(c))
        end
    ))
end
local p='afsafdfdsfsdeerv';

local cipher=aeslua.encrypt(p,'dgtttt')
local ss = string.tohex(cipher)
print(ss)

local out=aeslua.decrypt(p,string.fromhex(ss))

print(out)
