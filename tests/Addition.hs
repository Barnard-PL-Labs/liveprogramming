module Addition where

data X = X | Y

f :: X -> X
f x = Y

abs :: (Num n, Ord n) => n -> n
abs x
    | x >= 0 = x
    | otherwise = -x
