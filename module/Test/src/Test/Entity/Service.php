<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Proxy\Exception\InvalidArgumentException;

/** @ORM\Entity */
class Service {
    
    public static $TYPE_OTRS = "OTRS";
    
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255, unique=true) */
	protected $company;
	
	/** @ORM\Column(type="string", length=255) */
	protected $type;
	
	/** @ORM\Column(type="string", length=255) */
	protected $location;
	
	/** @ORM\Column(type="string", length=255) */
	protected $username;
	
	/** @ORM\Column(type="string", length=255) */
	protected $password;
	
	/** @ORM\Column(type="string", length=255) */
	protected $namespace;
	
	
	public function getId(){
	    return $this->id;
	}
    
    public function setId($id){
    	$this->id = $id;
    }
    
    public function getCompany(){
    	return $this->company;
    }
    
    public function setCompany($company){
    	$this->company = $company;
    }
    
    public function getType(){
    	return $this->type;
    }
    
    public function setType($type){
        if (!in_array($type, [self::TYPE_OTRS])) {
        	throw new InvalidArgumentException("Invalid type");
        }
    	$this->type = $type;
    }
    public function getLocation(){
    	return $this->location;
    }
    
    public function setLocation($location){
    	$this->location = $location;
    }
    public function getUsername(){
    	return $this->username;
    }
    
    public function setUsername($username){
    	$this->username = $username;
    }
    public function getPassword(){
    	return $this->password;
    }
    
    public function setPassword($password){
    	$this->password = $password;
    }
    
    public function getNamespace(){
    	return $this->namespace;
    }
    
    public function setNamespace($namespace){
    	$this->namespace = $namespace;
    }
}