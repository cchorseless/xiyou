package.path = package.path .. ";scripts/?.lua"
if table.unpack == nil then
    table.unpack = unpack
end

require "bit"
require "aeslua.aeslua"
require "lfs"

local util = require "aeslua.util"
local source_path = arg[1]
local target_path = arg[2]
local key = arg[3]
local code = arg[4]
local version = arg[5]or'1.0.0'

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

print("encrypt to ", source_path, target_path)
local file = io.open(source_path)
local text = '-- ' .. string.gsub(source_path, './game/scripts/vscripts', '') .. '\n' .. file:read("*all")
-- local text= '-- ' .. string.gsub(source_path, './game/scripts/vscripts', '') .. '\n' .. code
local cipher = aeslua.encrypt(key, text, aeslua.AES128, aeslua.CBCMODE)
local hexstring = string.tohex(cipher)
local wf = io.open(target_path, "w")
wf:write('require "aeslua.aeslua"\n\n return(decryptModule(aeslua.decrypt(aeslua.getServerKey("'..version..'") ,"' .. hexstring .. '")))')
file:close()
wf:flush()
wf:close()

print('[scripts/encrypt_file.lua] finished encypt file: ' .. source_path .. ' => ' .. target_path)